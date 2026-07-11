"use server";

import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/getCurrentUserId";
import { eventSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export async function getEvents() {
  const userId = await requireUserId();

  return prisma.event.findMany({
    where: { userId },
    orderBy: { startDate: "asc" },
  });
}

export async function createEvent(data: {
  title: string;
  type: "COURSE" | "EXAM";
  startDate: Date;
  endDate: Date;
  room?: string;
  color?: "BLUE" | "GREEN" | "ORANGE" | "PURPLE" | "RED";
  repeat?: "NONE" | "WEEKLY";
}) {
  const userId = await requireUserId();

  const parsed = eventSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((e) => e.message).join(", "));
  }

  const event = await prisma.event.create({
    data: {
      userId,
      title: parsed.data.title,
      type: parsed.data.type,
      startDate: parsed.data.startDate,
      endDate: parsed.data.endDate,
      room: parsed.data.room,
      color: parsed.data.color ?? "BLUE",
      repeat: parsed.data.repeat ?? "NONE",
    },
  });

  revalidatePath("/emploi_du_temp");
  return event;
}
