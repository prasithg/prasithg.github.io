export type CopyState = 'provisional' | 'pending-voice-pass';

export interface CopySlot {
  id: string;
  value: string;
  state: CopyState;
}

export interface Project {
  index: string;
  title: CopySlot;
  kind: CopySlot;
  description: CopySlot;
  tags: string[];
  href?: string;
  linkLabel?: CopySlot;
  featured?: boolean;
  tone: 'amber' | 'blue' | 'violet' | 'green' | 'slate';
  visual: 'voice' | 'mobile' | 'orchestration' | 'video' | 'shifts';
}

// All public-facing prose lives here so PrasClaw can replace provisional strings
// without editing layout components. `pending-voice-pass` deliberately renders as
// a visible copy slot until scope, wording, and a public link are verified.
const copy = (
  id: string,
  value: string,
  state: CopyState = 'provisional',
): CopySlot => ({ id, value, state });

export const siteContent = {
  meta: {
    title: copy('meta.title', 'Prasith Govin — Assistive AI & agent systems'),
    description: copy(
      'meta.description',
      'Prasith Govin builds practical agent systems, assistive AI, and operational tools with explicit human control.',
    ),
    imageAlt: copy(
      'meta.imageAlt',
      'Portrait of Prasith Govin, founder CTO building practical assistive AI and agent systems',
    ),
  },
  nav: {
    name: copy('nav.name', 'Prasith Govin'),
    items: [
      { label: copy('nav.builds', 'Builds'), href: '#builds' },
      { label: copy('nav.operating', 'Operating model'), href: '#operating-model' },
      { label: copy('nav.experiments', 'Experiments'), href: '#experiments' },
    ],
    contact: copy('nav.contact', 'Contact'),
  },
  hero: {
    eyebrow: copy('hero.eyebrow', 'Founder CTO / assistive AI'),
    titlePrimary: copy('hero.title.primary', 'Assistive AI for real work.'),
    titleSecondary: copy('hero.title.secondary', 'With people in control.'),
    intro: copy(
      'hero.intro',
      'I build agent systems for work where accuracy is only the start. The system also has to show its work, stop at the right boundary, and leave consequential decisions with a person.',
    ),
    primaryCta: copy('hero.cta.primary', 'See selected builds'),
    secondaryCta: copy('hero.cta.secondary', 'Open GitHub'),
    proofLabel: copy('hero.proof.label', 'Mission spine'),
    proofNodes: [
      copy('hero.proof.node.1', 'Speech'),
      copy('hero.proof.node.2', 'Agency'),
      copy('hero.proof.node.3', 'Work'),
    ],
    proofCenter: copy('hero.proof.center', 'Human control'),
  },
  profile: {
    name: copy('profile.name', 'Prasith Govin'),
    shortName: copy('profile.shortName', 'Pras'),
    location: copy('profile.location', 'Tampa ↔ NYC'),
    role: copy('profile.role', 'Co-founder / CTO, JobLeap AI'),
    imageAlt: copy(
      'profile.imageAlt',
      'Prasith Govin holding an early iPhone in front of an Apple logo',
    ),
  },
  builds: {
    kicker: copy('builds.kicker', 'Selected builds / proof of work'),
    title: copy('builds.title', 'Systems, not slideware.'),
    intro: copy(
      'builds.intro',
      'Public work and active builds across assistive speech, agent operations, media tooling, and shift coordination. Final project descriptions remain in the PrasClaw voice lane.',
    ),
  },
  projects: [
    {
      index: '01',
      title: copy('projects.parker.title', 'Parker'),
      kind: copy('projects.parker.kind', 'Featured / open source'),
      description: copy(
        'projects.parker.description',
        'An open-source voice assistant exploring repair, consent, confidence, and safe follow-through for effortful speech. Current evaluation work is bounded to public and synthetic data.',
      ),
      tags: ['assistive AI', 'speech repair', 'evals', 'Python'],
      href: 'https://github.com/prasithg/parker',
      linkLabel: copy('projects.parker.link', 'View public repository'),
      featured: true,
      tone: 'amber',
      visual: 'voice',
    },
    {
      index: '02',
      title: copy('projects.hermesMobile.title', 'Hermes Mobile'),
      kind: copy('projects.hermesMobile.kind', 'Active build'),
      description: copy(
        'projects.hermesMobile.description',
        'Copy slot reserved for PrasClaw. Confirm the public scope, evidence boundary, and destination before this card ships.',
        'pending-voice-pass',
      ),
      tags: ['mobile', 'agent interface', 'human control'],
      tone: 'blue',
      visual: 'mobile',
    },
    {
      index: '03',
      title: copy('projects.clawrari.title', 'Clawrari'),
      kind: copy('projects.clawrari.kind', 'Current experiment'),
      description: copy(
        'projects.clawrari.description',
        'Copy slot reserved for PrasClaw. Add a verified one-line scope and public receipt before enabling a project link.',
        'pending-voice-pass',
      ),
      tags: ['agents', 'orchestration', 'verification'],
      tone: 'violet',
      visual: 'orchestration',
    },
    {
      index: '04',
      title: copy('projects.videoEngine.title', 'video-engine'),
      kind: copy('projects.videoEngine.kind', 'Tooling'),
      description: copy(
        'projects.videoEngine.description',
        'Copy slot reserved for PrasClaw. Public positioning, proof artifact, and repository destination are still pending review.',
        'pending-voice-pass',
      ),
      tags: ['media systems', 'automation', 'pipeline'],
      tone: 'slate',
      visual: 'video',
    },
    {
      index: '05',
      title: copy('projects.jobleap.title', 'JobLeap / WorkConnect'),
      kind: copy('projects.jobleap.kind', 'Company context'),
      description: copy(
        'projects.jobleap.description',
        'The company context is a shift marketplace and shift-orchestration platform. Final public wording and product boundaries remain with the PrasClaw copy pass.',
      ),
      tags: ['shift marketplace', 'workforce', 'founder CTO'],
      href: 'https://jobleap.ai',
      linkLabel: copy('projects.jobleap.link', 'Visit JobLeap'),
      tone: 'green',
      visual: 'shifts',
    },
  ] satisfies Project[],
  operating: {
    kicker: copy('operating.kicker', 'Operating story'),
    title: copy('operating.title', 'From scale to a small, agent-amplified team.'),
    body: copy(
      'operating.body',
      'I spent years leading large product and engineering organizations. Now I am testing what changes with a small team, explicit agent roles, tight evaluation loops, and a human owner for every irreversible decision.',
    ),
    stages: [
      {
        index: '01',
        label: copy('operating.stage.1.label', 'Enterprise CTO'),
        detail: copy('operating.stage.1.detail', 'Teams, systems, and operating constraints at scale.'),
      },
      {
        index: '02',
        label: copy('operating.stage.2.label', 'Founder CTO'),
        detail: copy('operating.stage.2.detail', 'Small teams with agents assigned explicit roles.'),
      },
      {
        index: '03',
        label: copy('operating.stage.3.label', 'Human owner'),
        detail: copy('operating.stage.3.detail', 'Evidence, review, and stop conditions before action.'),
      },
    ],
    principles: [
      copy('operating.principle.1', 'Public conclusions should point back to an artifact or receipt.'),
      copy('operating.principle.2', 'Agents need explicit roles, review paths, and stop conditions.'),
      copy('operating.principle.3', 'Assistive systems should preserve the user’s dignity and control.'),
      copy('operating.principle.4', 'Approval boundaries are part of the product, not a later safety layer.'),
    ],
  },
  experiments: {
    kicker: copy('experiments.kicker', 'Current experiments / build log'),
    title: copy('experiments.title', 'What is being tested now.'),
    intro: copy(
      'experiments.intro',
      'A compact, reversible status surface. No activity is represented as shipped without a public receipt.',
    ),
    rows: [
      {
        time: '01',
        name: copy('experiments.parker.name', 'Parker evaluations'),
        detail: copy('experiments.parker.detail', 'Public + synthetic data boundary'),
        status: copy('experiments.parker.status', 'evaluating'),
      },
      {
        time: '02',
        name: copy('experiments.supervision.name', 'Agent supervision'),
        detail: copy('experiments.supervision.detail', 'Observe → classify → bounded action → verify → handoff'),
        status: copy('experiments.supervision.status', 'testing'),
      },
      {
        time: '03',
        name: copy('experiments.copy.name', 'prasithg.com copy'),
        detail: copy('experiments.copy.detail', 'Public strings pending PrasClaw voice review'),
        status: copy('experiments.copy.status', 'copy pass'),
      },
    ],
  },
  contact: {
    kicker: copy('contact.kicker', 'Compare notes'),
    title: copy('contact.title', 'Building agents for high-constraint work?'),
    body: copy(
      'contact.body',
      'I am interested in practical agents, assistive AI, evaluations, operational handoffs, and the boundaries that keep people responsible for consequential decisions.',
    ),
    linkedIn: copy('contact.linkedin', 'Connect on LinkedIn'),
    github: copy('contact.github', 'Follow the public work'),
  },
  footer: {
    legal: copy('footer.legal', '© 2026 Prasith Govin'),
    note: copy('footer.note', 'Built as a static Astro site. No trackers.'),
  },
} as const;

export const externalLinks = {
  github: 'https://github.com/prasithg',
  linkedIn: 'https://www.linkedin.com/in/prasithg',
  x: 'https://x.com/prasithg',
  jobleap: 'https://jobleap.ai',
} as const;
