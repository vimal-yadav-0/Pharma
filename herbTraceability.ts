import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';

// Data Models
export interface GPS {
    lat: number;
    lng: number;
}

export interface Quality {
    moisture: number;
    pesticide: boolean;
    dnaBarcode: boolean;
}

export interface CollectionEvent {
    id: string;
    gps: GPS;
    timestamp: string;
    species: string;
    collectorId: string;
    quality: Quality;
}

export interface ProcessingStep {
    id: string;
    stepType: string;
    details: string;
    timestamp: string;
    operatorId: string;
}

export interface QualityTest {
    id: string;
    labId: string;
    testType: string;
    results: any;
    certificateHash: string;
}

export interface Provenance {
    batchId: string;
    linkedEvents: string[];
    finalProductDetails: any;
}

// Example constants for validation
const ALLOWED_ZONES = [
    { latMin: 18.0, latMax: 20.0, lngMin: 73.0, lngMax: 75.0 }, // Example region
];
const ALLOWED_SEASONS = {
    'Withania somnifera': { start: '2025-10-01', end: '2026-03-31' }, // Ashwagandha
};
const QUALITY_THRESHOLDS = {
    moisture: 10.0, // max %
    pesticide: false, // must be false
    dnaBarcode: true, // must be true
};

function isInAllowedZone(gps: GPS): boolean {
    return ALLOWED_ZONES.some(zone =>
        gps.lat >= zone.latMin && gps.lat <= zone.latMax &&
        gps.lng >= zone.lngMin && gps.lng <= zone.lngMax
    );
}

function isInAllowedSeason(species: string, timestamp: string): boolean {
    const season = ALLOWED_SEASONS[species];
    if (!season) return false;
    const date = new Date(timestamp);
    const start = new Date(season.start);
    const end = new Date(season.end);
    return date >= start && date <= end;
}

function meetsQuality(quality: Quality): boolean {
    return (
        quality.moisture <= QUALITY_THRESHOLDS.moisture &&
        quality.pesticide === QUALITY_THRESHOLDS.pesticide &&
        quality.dnaBarcode === QUALITY_THRESHOLDS.dnaBarcode
    );
}

// FHIR Bundle utilities (for API integration)
// Parse a FHIR Bundle and map to event types
export function parseFhirBundle(bundle: any): any[] {
    if (!bundle || bundle.resourceType !== 'Bundle' || !Array.isArray(bundle.entry)) return [];
    return bundle.entry.map((entry: any) => entry.resource);
}

// Create a FHIR Bundle from a list of events
export function createFhirBundle(events: any[]): any {
    return {
        resourceType: 'Bundle',
        type: 'collection',
        entry: events.map(e => ({ resource: e }))
    };
}

@Info({ title: 'HerbTraceabilityContract', description: 'Smart contract for Ayurvedic herb traceability' })
export class HerbTraceabilityContract extends Contract {
    // CollectionEvent
    @Transaction()
    public async recordCollectionEvent(ctx: Context, eventStr: string): Promise<void> {
        const event: CollectionEvent = JSON.parse(eventStr);
        if (!isInAllowedZone(event.gps)) {
            throw new Error('CollectionEvent: GPS not in allowed harvesting zone');
        }
        if (!isInAllowedSeason(event.species, event.timestamp)) {
            throw new Error('CollectionEvent: Not in allowed harvest season');
        }
        if (!meetsQuality(event.quality)) {
            throw new Error('CollectionEvent: Quality thresholds not met');
        }
        await ctx.stub.putState(event.id, Buffer.from(JSON.stringify(event)));
    }

    // ProcessingStep
    @Transaction()
    public async addProcessingStep(ctx: Context, stepStr: string): Promise<void> {
        const step: ProcessingStep = JSON.parse(stepStr);
        await ctx.stub.putState(step.id, Buffer.from(JSON.stringify(step)));
    }

    // QualityTest
    @Transaction()
    public async uploadQualityTest(ctx: Context, testStr: string): Promise<void> {
        const test: QualityTest = JSON.parse(testStr);
        await ctx.stub.putState(test.id, Buffer.from(JSON.stringify(test)));
    }

    // Provenance
    @Transaction()
    public async createProvenance(ctx: Context, provenanceStr: string): Promise<void> {
        const provenance: Provenance = JSON.parse(provenanceStr);
        await ctx.stub.putState(provenance.batchId, Buffer.from(JSON.stringify(provenance)));
    }

    // Example: Read event by ID
    @Transaction(false)
    @Returns('string')
    public async readEvent(ctx: Context, id: string): Promise<string> {
        const data = await ctx.stub.getState(id);
        if (!data || data.length === 0) {
            throw new Error(`Event with ID ${id} does not exist`);
        }
        return data.toString();
    }
}
