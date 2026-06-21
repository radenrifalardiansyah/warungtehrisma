import Image from 'next/image';
import halalLogo from '@/assets/images/logo-halal-indonesia.png';

export default function HalalBadge({ size = 40 }: { size?: number }) {
  return (
    <Image
      src={halalLogo}
      alt="Logo Halal Indonesia"
      width={size}
      height={size}
      className="object-contain"
    />
  );
}
