import { Hero } from '@/components/Hero';
import { DoorsSection } from '@/components/DoorsSection';
import { TimelineSection } from '@/components/TimelineSection';
import { CertificationsSection } from '@/components/CertificationsSection';
import { ClosingCTA } from '@/components/ClosingCTA';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section with 3D Ability Card & Stats */}
      <Hero />

      {/* Work: One Door per Skill Section */}
      <DoorsSection />

      {/* My Story: Interactive Timeline */}
      <TimelineSection />

      {/* Certifications: Grid with DP-600 Featured */}
      <CertificationsSection />

      {/* Final Closing Call to Action */}
      <ClosingCTA />
    </div>
  );
}

