import { api } from '../utils/api';

interface AddressUpdate {
  address: string;
  city: string;
  postalCode: string;
}

interface UserUpdateResponse {
  id: number;
  firstName: string;
  lastName: string;
  address: {
    address: string;
    city: string;
    postalCode: string;
  };
}

/**
 * Update user's shipping address
 * Note: DummyJSON simulates the update but doesn't actually persist data
 */
export const updateUserAddress = async (
  userId: number,
  addressData: AddressUpdate
): Promise<UserUpdateResponse> => {
  return api.put<UserUpdateResponse>(`/users/${userId}`, {
    address: {
      address: addressData.address,
      city: addressData.city,
      postalCode: addressData.postalCode,
    },
  });
};
