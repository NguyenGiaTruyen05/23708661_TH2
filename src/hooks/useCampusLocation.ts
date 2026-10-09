import { Platform, Linking } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {
    check,
    request,
    RESULTS,
    PERMISSIONS,
    PermissionStatus,
} from 'react-native-permissions';
import { create } from 'zustand';

import {
    BASE_SHIP_FEE,
    VARIANT,
} from '@constants/student';

export type LocationPermissionStatus =
    | 'idle'
    | 'loading'
    | 'granted'
    | 'denied'
    | 'blocked'
    | 'error';

export type CampusLocation = {
    latitude: number;
    longitude: number;
};

type CampusLocationState = {
    permissionStatus: LocationPermissionStatus;
    location: CampusLocation | null;
    distanceKm: number | null;
    shippingFee: number | null;
    error: string;
    requestLocation: () => Promise<void>;
};

const KTX_GATE = {
    latitude: 10.8411,
    longitude: 106.8098,
};

function haversineDistanceKm(
    latitude: number,
    longitude: number,
): number {
    const earthRadiusKm = 6371;

    const dLat =
        ((latitude - KTX_GATE.latitude) * Math.PI) / 180;

    const dLon =
        ((longitude - KTX_GATE.longitude) * Math.PI) / 180;

    const lat1 =
        (KTX_GATE.latitude * Math.PI) / 180;

    const lat2 =
        (latitude * Math.PI) / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c =
        2 * Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a),
        );

    return earthRadiusKm * c;
}

function calculateShippingFee(
    distanceKm: number,
): number {
    if (VARIANT.shipFormula === 'A') {
        return (
            BASE_SHIP_FEE +
            Math.round(distanceKm * 2000)
        );
    }

    return (
        BASE_SHIP_FEE +
        Math.round(distanceKm * 1500) +
        2000
    );
}

function getPermission() {
    return Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
}

async function getCurrentPermission(): Promise<PermissionStatus> {
    return check(getPermission());
}

export const useCampusLocationStore =
    create<CampusLocationState>(set => ({
        permissionStatus: 'idle',
        location: null,
        distanceKm: null,
        shippingFee: null,
        error: '',

        requestLocation: async () => {
            set({
                permissionStatus: 'loading',
                error: '',
            });

            try {
                let permission =
                    await getCurrentPermission();

                if (permission === RESULTS.BLOCKED) {
                    await Linking.openSettings();

                    set({
                        permissionStatus: 'blocked',
                        error:
                            'Quyền Location đang bị chặn. Hãy mở Cài đặt để cấp quyền.',
                    });

                    return;
                }

                if (permission === RESULTS.DENIED) {
                    permission = await request(
                        getPermission(),
                    );
                }

                if (permission === RESULTS.BLOCKED) {
                    await Linking.openSettings();

                    set({
                        permissionStatus: 'blocked',
                        error:
                            'Quyền Location đang bị chặn. Hãy mở Cài đặt để cấp quyền.',
                    });

                    return;
                }

                if (permission !== RESULTS.GRANTED) {
                    set({
                        permissionStatus: 'denied',
                        error:
                            'Bạn chưa cấp quyền truy cập vị trí.',
                    });

                    return;
                }

                Geolocation.getCurrentPosition(
                    position => {
                        const latitude =
                            position.coords.latitude;

                        const longitude =
                            position.coords.longitude;

                        const distanceKm =
                            haversineDistanceKm(
                                latitude,
                                longitude,
                            );

                        const shippingFee =
                            calculateShippingFee(distanceKm);

                        set({
                            permissionStatus: 'granted',
                            location: {
                                latitude,
                                longitude,
                            },
                            distanceKm,
                            shippingFee,
                            error: '',
                        });
                    },

                    error => {
                        set({
                            permissionStatus: 'error',
                            error: error.message,
                        });
                    },

                    {
                        enableHighAccuracy: true,
                        timeout: 15000,
                        maximumAge: 10000,
                        forceRequestLocation: true,
                        showLocationDialog: true,
                    },
                );
            } catch (error) {
                set({
                    permissionStatus: 'error',
                    error:
                        error instanceof Error
                            ? error.message
                            : 'Không thể lấy vị trí.',
                });
            }
        },
    }));

export function useCampusLocation() {
    return useCampusLocationStore();
}