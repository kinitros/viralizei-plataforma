import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Determina a cor do header do card de serviço baseado na plataforma e região
 * @param platform - A plataforma do serviço (instagram, tiktok, youtube, facebook, twitter, kwai)
 * @param isBrazilian - Se o serviço é brasileiro/nacional
 * @returns A classe CSS do Tailwind para o background do header
 */
export function getHeaderBgClass(platform: string, isBrazilian: boolean): string {
  // Todos os serviços brasileiros têm header verde
  if (isBrazilian) {
    return 'bg-green-600';
  }

  // Cores específicas por plataforma para serviços mundiais/internacionais
  switch (platform.toLowerCase()) {
    case 'instagram':
      return 'bg-pink-600';
    case 'tiktok':
      return 'bg-black';
    case 'youtube':
      return 'bg-red-600';
    case 'twitter':
    case 'x':
      return 'bg-black';
    case 'facebook':
      return 'bg-blue-600';
    case 'kwai':
      return 'bg-orange-600';
    default:
      // Fallback para verde se a plataforma não for reconhecida
      return 'bg-green-600';
  }
}
