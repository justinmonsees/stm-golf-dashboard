"use server";

import React from "react";

import { getAttendees } from "@/lib/actions/attendeeActions";
import { getCurrentEvent } from "@/lib/actions/eventActions";
import AttendeesSection from "@/components/AttendeesSection";

const Attendees = async () => {
  const [attendees, currentEvent] = await Promise.all([
    getAttendees(),
    getCurrentEvent(),
  ]);

  return (
    <>
      <AttendeesSection attendees={attendees} curEvent={currentEvent[0]} />
    </>
  );
};

export default Attendees;