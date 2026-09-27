"""Capture BK Picker Tauri window screenshots for the landing page."""
from __future__ import annotations

import time
from pathlib import Path

import win32con
import win32gui
from ctypes import windll
from PIL import ImageGrab


OUT = Path(r"c:\Users\atafo\dev\desktop\bk-picker\docs\assets")
OUT.mkdir(parents=True, exist_ok=True)


def find_tauri_hwnd() -> int | None:
    found: list[tuple[int, int]] = []

    def enum_handler(hwnd: int, _):
        if not win32gui.IsWindowVisible(hwnd):
            return
        if win32gui.GetClassName(hwnd) != "Tauri Window":
            return
        title = win32gui.GetWindowText(hwnd)
        if "BK Picker" not in title:
            return
        left, top, right, bottom = win32gui.GetWindowRect(hwnd)
        area = (right - left) * (bottom - top)
        found.append((area, hwnd))

    win32gui.EnumWindows(enum_handler, None)
    if not found:
        return None
    found.sort(reverse=True)
    return found[0][1]


def capture(hwnd: int, path: Path) -> None:
    win32gui.ShowWindow(hwnd, win32con.SW_RESTORE)
    win32gui.SetForegroundWindow(hwnd)
    time.sleep(0.35)
    left, top, right, bottom = win32gui.GetWindowRect(hwnd)
    img = ImageGrab.grab(bbox=(left, top, right, bottom), all_screens=True)
    img.save(path, "PNG")
    print(f"saved {path} {img.size}")


def click_at(hwnd: int, rel_x: float, rel_y: float) -> None:
    left, top, right, bottom = win32gui.GetWindowRect(hwnd)
    x = left + int((right - left) * rel_x)
    y = top + int((bottom - top) * rel_y)
    win32gui.SetForegroundWindow(hwnd)
    time.sleep(0.12)
    windll.user32.SetCursorPos(x, y)
    time.sleep(0.05)
    windll.user32.mouse_event(2, 0, 0, 0, 0)
    windll.user32.mouse_event(4, 0, 0, 0, 0)
    time.sleep(0.75)


def main() -> None:
    hwnd = find_tauri_hwnd()
    if not hwnd:
        raise SystemExit("Tauri BK Picker window not found")

    print("hwnd", hwnd, "cls", win32gui.GetClassName(hwnd), win32gui.GetWindowText(hwnd))

    # Color
    click_at(hwnd, 0.18, 0.08)
    capture(hwnd, OUT / "01-color.png")

    # Image
    click_at(hwnd, 0.50, 0.08)
    capture(hwnd, OUT / "02-image.png")

    # Settings
    click_at(hwnd, 0.82, 0.08)
    capture(hwnd, OUT / "03-settings.png")

    # Color + systems accordion
    click_at(hwnd, 0.18, 0.08)
    click_at(hwnd, 0.50, 0.82)
    capture(hwnd, OUT / "04-systems.png")

    print("done")


if __name__ == "__main__":
    main()
