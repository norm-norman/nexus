import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import type { GeocodedLocation } from '@nexus/types';
import { firstValueFrom } from 'rxjs';

export type Location = GeocodedLocation;

interface MapboxGeocodeFeature {
    place_name?: string;
    text?: string;
    center?: [number, number];
}

interface MapboxGeocodeResponse {
    features?: MapboxGeocodeFeature[];
}

@Injectable()
export class LocationService {
    constructor(
        private readonly httpService: HttpService) { }

    async getLocation(location: string): Promise<GeocodedLocation | null> {
        const query = location?.trim() ?? '';
        const token =
            process.env.MAPBOX_ACCESS_TOKEN?.trim() ||
            process.env.MAPBOX_TOKEN?.trim();

        if (!query || !token) {
            return null;
        }

        try {
            const encoded = encodeURIComponent(query);
            const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encoded}.json`;
            const { data } = await firstValueFrom(
                this.httpService.get<MapboxGeocodeResponse>(url, {
                    params: { access_token: token, limit: 1 },
                }),
            );

            const feature = data.features?.[0];
            if (!feature?.center || feature.center.length < 2) {
                return null;
            }

            const [lon, lat] = feature.center;
            const display_name = feature.text ?? feature.place_name ?? '';

            return {
                name: query,
                display_name,
                lat,
                lon,
            };
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}
