export type CopyState = 'reviewed';

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
  availabilityLabel?: CopySlot;
  featured?: boolean;
  tone: 'amber' | 'blue' | 'violet' | 'green' | 'slate';
  visual: 'voice' | 'mobile' | 'orchestration' | 'video' | 'shifts';
}

// Public-facing prose lives here so copy can be reviewed without changing layout components.
const copy = (
  id: string,
  value: string,
  state: CopyState = 'reviewed',
): CopySlot => ({ id, value, state });

export const siteContent = {
  meta: {
    title: copy('meta.title', 'Prasith Govin: Founder, CTO, agent builder'),
    description: copy(
      'meta.description',
      'I build small teams of AI agents that ship real software, including a shift marketplace for frontline workers and voice-first assistive AI.',
    ),
    ogTitle: copy('meta.ogTitle', 'Prasith Govin'),
    ogDescription: copy(
      'meta.ogDescription',
      'Founder and CTO building assistive AI, agent orchestration, a frontline shift marketplace, and voice-first tools.',
    ),
    imageAlt: copy(
      'meta.imageAlt',
      'Portrait of Prasith Govin, founder and CTO building assistive AI and agent systems',
    ),
  },
  nav: {
    name: copy('nav.name', 'prasithg'),
    items: [
      { label: copy('nav.building', 'Building'), href: '#building' },
      { label: copy('nav.work', 'Work'), href: '#work' },
    ],
    contact: copy('nav.contact', 'Contact'),
  },
  hero: {
    eyebrow: copy('hero.eyebrow', 'Founder, CTO, agent builder'),
    titlePrimary: copy('hero.title.primary', 'I build small teams of AI agents'),
    titleSecondary: copy('hero.title.secondary', 'that ship real software.'),
    intro: copy(
      'hero.intro',
      'CTO and founder. I spent years running enterprise engineering. Now I run lean teams where a few people plus a fleet of agents do the work of a much larger org. Most of what I build points at one idea: putting capable AI in the hands of the people who need it most, from frontline workers to people navigating effortful speech.',
    ),
    primaryCta: copy('hero.cta.primary', "See what I'm building"),
    secondaryCta: copy('hero.cta.secondary', 'Get in touch'),
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
    kicker: copy('builds.kicker', 'Selected builds'),
    title: copy('builds.title', 'Building'),
    intro: copy(
      'builds.intro',
      'Active projects. Some are companies, some are experiments.',
    ),
  },
  projects: [
    {
      index: '01',
      title: copy('projects.parker.title', 'Parker'),
      kind: copy('projects.parker.kind', 'Featured / open source'),
      description: copy(
        'projects.parker.description',
        "A voice-first agentic assistant designed for effortful speech. It helps with reminders, medication timing, calls for help, and staying connected. The hardest and most personal thing I've built.",
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
      title: copy('projects.hermes.title', 'Hermes'),
      kind: copy('projects.hermes.kind', 'Active build'),
      description: copy(
        'projects.hermes.description',
        'A personal-assistant agent that runs on my own devices. It manages my life the way a chief of staff would: memory, coordination, and a second agent it works alongside.',
      ),
      tags: ['personal agent', 'memory', 'coordination'],
      href: 'https://github.com/NousResearch/hermes-agent',
      linkLabel: copy('projects.hermes.link', 'View Hermes Agent'),
      tone: 'blue',
      visual: 'mobile',
    },
    {
      index: '03',
      title: copy('projects.clawrari.title', 'Clawrari'),
      kind: copy('projects.clawrari.kind', 'Agent orchestration'),
      description: copy(
        'projects.clawrari.description',
        'My agent-orchestration stack. The tooling and playbooks that let one operator direct many agents on engineering work: build, review, ship.',
      ),
      tags: ['agents', 'orchestration', 'verification'],
      href: 'https://github.com/prasithg/clawrari',
      linkLabel: copy('projects.clawrari.link', 'View public repository'),
      tone: 'violet',
      visual: 'orchestration',
    },
    {
      index: '04',
      title: copy('projects.videoEngine.title', 'video-engine'),
      kind: copy('projects.videoEngine.kind', 'Private tooling'),
      description: copy(
        'projects.videoEngine.description',
        'A pipeline that turns ideas into finished video with agents doing the heavy lifting, from script to render.',
      ),
      tags: ['media systems', 'automation', 'pipeline'],
      availabilityLabel: copy('projects.videoEngine.availability', 'Private build'),
      tone: 'slate',
      visual: 'video',
    },
    {
      index: '05',
      title: copy('projects.jobleap.title', 'JobLeap / WorkConnect'),
      kind: copy('projects.jobleap.kind', 'Company'),
      description: copy(
        'projects.jobleap.description',
        'A shift marketplace and orchestration platform for the frontline workforce: matching demand to supply, credentialing, scheduling, and pay. Built with UKG Labs as partner and investor.',
      ),
      tags: ['shift marketplace', 'workforce', 'founder CTO'],
      href: 'https://jobleap.ai',
      linkLabel: copy('projects.jobleap.link', 'Visit JobLeap'),
      tone: 'green',
      visual: 'shifts',
    },
  ] satisfies Project[],
  operating: {
    kicker: copy('operating.kicker', 'How I work'),
    title: copy('operating.title', 'How I work'),
    body: [
      copy(
        'operating.body.1',
        'I came up as an enterprise CTO: big systems, big teams, big process. I am now running as a founder CTO with the opposite shape: tiny teams, amplified by agents.',
      ),
      copy(
        'operating.body.2',
        "The bet is simple. A small group that knows how to direct AI can out-build a large one that does not. I spend my time on the parts that still need a human: deciding what is worth building, reviewing what the agents produce, and keeping the whole thing honest. The rest gets delegated to a stack I've been sharpening for months.",
      ),
      copy(
        'operating.body.3',
        'It is how I ship a company, a voice-first assistant, and a handful of tools at the same time.',
      ),
    ],
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
    kicker: copy('experiments.kicker', 'Current experiments'),
    title: copy('experiments.title', 'Build log'),
    intro: copy(
      'experiments.intro',
      "What I'm poking at right now. Rough, dated, honest.",
    ),
    rows: [
      {
        time: 'Jul 2026',
        name: copy('experiments.coordination.name', 'Hermes + Claw coordination'),
        detail: copy(
          'experiments.coordination.detail',
          "Two agents that build and review each other's work over a private channel.",
        ),
        status: copy('experiments.coordination.status', 'active'),
      },
      {
        time: 'Jul 2026',
        name: copy('experiments.site.name', 'prasithg.com rebuild'),
        detail: copy(
          'experiments.site.detail',
          'Astro, agent-driven, deployed through a gated GitHub Pages workflow.',
        ),
        status: copy('experiments.site.status', 'public / green'),
      },
      {
        time: 'Jul 2026',
        name: copy('experiments.harnessDelta.name', 'Harness Delta'),
        detail: copy(
          'experiments.harnessDelta.detail',
          'A matched agent eval that stopped at the isolation and parity gates before either model ran.',
        ),
        status: copy('experiments.harnessDelta.status', 'abstained / verified'),
        href: '/work/harness-delta/',
        linkLabel: copy('experiments.harnessDelta.link', 'Read the abstention note'),
      },
      {
        time: 'Jul 2026',
        name: copy('experiments.traceTripwire.name', 'Trace-to-Tripwire'),
        detail: copy(
          'experiments.traceTripwire.detail',
          'A metadata-only receipt experiment for replayable agent policy checks.',
        ),
        status: copy('experiments.traceTripwire.status', 'public source / CI green'),
        href: '/work/trace-to-tripwire/',
        linkLabel: copy('experiments.traceTripwire.link', 'Read the evidence note'),
      },
    ],
  },
  contact: {
    kicker: copy('contact.kicker', 'Contact'),
    title: copy('contact.title', 'Get in touch'),
    body: copy(
      'contact.body',
      "Building something at the edge of AI and real work? I'm interested.",
    ),
    linkedIn: copy('contact.linkedin', 'Connect on LinkedIn'),
    github: copy('contact.github', 'View GitHub'),
  },
  footer: {
    legal: copy('footer.legal', '© 2026 Prasith Govin'),
    note: copy('footer.note', 'Built with agents.'),
  },
} as const;

export const externalLinks = {
  github: 'https://github.com/prasithg',
  linkedIn: 'https://www.linkedin.com/in/prasithg',
  x: 'https://x.com/prasithg',
  jobleap: 'https://jobleap.ai',
} as const;
