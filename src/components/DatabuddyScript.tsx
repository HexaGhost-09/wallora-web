"use client";

import { Databuddy } from '@databuddy/sdk';

export function DatabuddyScript() {
    return (
        <Databuddy
            clientId="qfFIcKvJLpTYUnvl6Ry7e"
            trackHashChanges={true}
            trackAttributes={true}
            trackOutgoingLinks={true}
            trackInteractions={true}
            trackEngagement={true}
            trackScrollDepth={true}
            trackExitIntent={true}
            trackBounceRate={true}
            trackWebVitals={true}
            trackErrors={true}
            enableBatching={true}
        />
    );
}