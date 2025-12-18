import { v4 as uuid } from "uuid";
import { NotificationProps } from "types";

export const NotificationItems: NotificationProps[] = [
  {
    id: uuid(),
    sender: "Administrator",
    message: `Please change the default password after logging in.`,
  },
  {
    id: uuid(),
    sender: "Administrator",
    message: `You can change your avatar as you wish.`,
  },
  {
    id: uuid(),
    sender: "Administrator",
    message: `Users can only edit their own report data.`,
  },
];
