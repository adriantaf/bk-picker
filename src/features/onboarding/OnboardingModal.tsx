import {
  Button,
  List,
  Modal,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";

type OnboardingModalProps = {
  opened: boolean;
  onClose: () => void;
  labels: {
    title: string;
    body: string;
    itemShortcut: string;
    itemEyedropper: string;
    itemImage: string;
    itemSystems: string;
    cta: string;
  };
};

export function OnboardingModal({
  opened,
  onClose,
  labels,
}: OnboardingModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text fw={700} size="md">
          {labels.title}
        </Text>
      }
      centered
      radius="md"
      overlayProps={{ backgroundOpacity: 0.45, blur: 2 }}
    >
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          {labels.body}
        </Text>
        <List
          spacing="sm"
          size="sm"
          center
          icon={
            <ThemeIcon color="blue" size={18} radius="xl" variant="light">
              <Text size="10px" fw={700}>
                •
              </Text>
            </ThemeIcon>
          }
        >
          <List.Item>{labels.itemShortcut}</List.Item>
          <List.Item>{labels.itemEyedropper}</List.Item>
          <List.Item>{labels.itemImage}</List.Item>
          <List.Item>{labels.itemSystems}</List.Item>
        </List>
        <Button fullWidth onClick={onClose}>
          {labels.cta}
        </Button>
      </Stack>
    </Modal>
  );
}
