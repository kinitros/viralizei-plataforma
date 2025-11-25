import axios from 'axios';

const API_BASE_URL = import.meta.env.PROD 
  ? window.location.origin 
  : 'http://localhost:3001';

export interface CreatePixRequest {
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_document?: string;
  instagram_username: string;
  service_type: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
}

export interface CreatePixResponse {
  success: boolean;
  data?: {
    order_id: string;
    qr_code: string;
    qr_code_base64: string;
    copy_paste_code: string;
    expiration_at: string;
  };
  error?: string;
}

export interface PixStatusResponse {
  success: boolean;
  data?: {
    order_id: string;
    status: string;
    paid_at?: string;
    total_amount: number;
  };
  error?: string;
}

export class PixService {
  async createPixCharge(request: CreatePixRequest): Promise<CreatePixResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/pix/create`, request, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      });

      return response.data;
    } catch (error: any) {
      console.error('[PixService] Error creating PIX:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao criar cobrança PIX',
      };
    }
  }

  async checkPixStatus(orderId: string): Promise<PixStatusResponse> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/pix/status/${orderId}`, {
        timeout: 10000,
      });

      return response.data;
    } catch (error: any) {
      console.error('[PixService] Error checking PIX status:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao verificar status do PIX',
      };
    }
  }
}

export const pixService = new PixService();