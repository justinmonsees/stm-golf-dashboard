"use server";

import React from "react";
import { getCommitteeMembers } from "@/lib/actions/committeeMemberActions";
import { getSponsors } from "@/lib/actions/sponsorActions";
import { getCurrentEvent } from "@/lib/actions/eventActions";
import SponsorsSection from "@/components/SponsorsSection";

const Sponsors = async () => {
  const [sponsors, committeeMembers, eventInfo] = await Promise.all([
    getSponsors(),
    getCommitteeMembers(),
    getCurrentEvent(),
  ]);

  return (
    <>
      <SponsorsSection
        sponsors={sponsors}
        committeeMembers={committeeMembers}
        eventInfo={eventInfo[0]}
      />
    </>
  );
};

export default Sponsors;