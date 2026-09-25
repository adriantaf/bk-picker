import { playCaptureChime } from "@/lib/feedback";
import { notifications } from "@mantine/notifications";

export function notifyColorCaptured(hex: string, title: string): void {
  playCaptureChime();
  notifications.show({
    title,
    message: hex,
    color: "teal",
    autoClose: 1500,
    withBorder: true,
    radius: "md",
  });
}

export function notifyCopiedLocal(message: string, title: string): void {
  playCaptureChime();
  notifications.show({
    title,
    message,
    color: "teal",
    autoClose: 1400,
    withBorder: true,
    radius: "md",
  });
}

export function notifyError(title: string, message?: string): void {
  notifications.show({
    title,
    message: message ?? "",
    color: "red",
    autoClose: 2800,
    withBorder: true,
    radius: "md",
  });
}
