export interface EvidenceCopySlot {
  id: string;
  value: string;
  state: 'reviewed';
}

export interface EvidenceHomepageRow {
  order: number;
  time: string;
  name: EvidenceCopySlot;
  detail: EvidenceCopySlot;
  status: EvidenceCopySlot;
  linkLabel: EvidenceCopySlot;
}

export interface EvidencePublicProvenance {
  kind: 'public';
  verifiedOn: string;
  label: string;
  href: `https://github.com/${string}`;
}

export interface EvidenceLocalProvenance {
  kind: 'local';
  verifiedOn: string;
  boundary: 'Local-only evidence. No public source revision exists.';
}

export interface EvidenceNote {
  index: string;
  title: string;
  href: `/work/${string}/`;
  status: string;
  summary: string;
  receipt: readonly string[];
  limit: string;
  surfaces: readonly string[];
  provenance: EvidencePublicProvenance | EvidenceLocalProvenance;
  homepageRows: readonly EvidenceHomepageRow[];
}

const copy = (id: string, value: string): EvidenceCopySlot => ({ id, value, state: 'reviewed' });

export const evidenceCatalog = [
  {
    index: '01',
    title: 'Trace-to-Tripwire',
    href: '/work/trace-to-tripwire/',
    status: 'Metadata only / CI green',
    summary: 'A small compiler that turns agent traces into replayable policy checks without carrying prompt or transcript content into the receipt.',
    receipt: ['13 / 13 site tests', '3 public source contracts', '1 hosted workflow'],
    limit: 'No live exporter receipt, signed release, package-index release, or downstream consumer receipt.',
    surfaces: ['Public source', 'Hosted run', 'Live route'],
    provenance: {
      kind: 'public',
      verifiedOn: '2026-07-16',
      label: 'Published note source',
      href: 'https://github.com/prasithg/prasithg.github.io/blob/150a4aeec8d4efdd6dd7a8d2c0a0b5539dee5bfe/src/pages/work/trace-to-tripwire.astro',
    },
    homepageRows: [
      {
        order: 120,
        time: 'Jul 2026',
        name: copy('experiments.traceTripwire.name', 'Trace-to-Tripwire'),
        detail: copy('experiments.traceTripwire.detail', 'A metadata-only receipt experiment for replayable agent policy checks.'),
        status: copy('experiments.traceTripwire.status', 'public source / CI green'),
        linkLabel: copy('experiments.traceTripwire.link', 'Read the evidence note'),
      },
    ],
  },
  {
    index: '02',
    title: 'Parker confirmation repair',
    href: '/work/parker-confirmation-repair/',
    status: 'Open PR / synthetic eval green',
    summary: 'A synthetic effortful none-of-these rejection now terminally cancels the exact read-back target and clears stale confirmation context.',
    receipt: ['9 / 9 synthetic scenarios', '635 / 635 full tests', '1 hosted CI check'],
    limit: 'PR 19 is open, unmerged, stacked on PR 13, and independently unreviewed. This is not patient, caregiver-usability, clinical, or production evidence.',
    surfaces: ['Public pull request', 'Synthetic report', 'Hosted run', 'Live route'],
    provenance: {
      kind: 'public',
      verifiedOn: '2026-07-17',
      label: 'Exact synthetic report',
      href: 'https://github.com/prasithg/parker/blob/9e4460538f94be883c786229a8b992d74b802aa1/benchmark/reports/parker_demo_interactivity_eval_latest.json',
    },
    homepageRows: [
      {
        order: 30,
        time: 'Jul 2026',
        name: copy('experiments.parkerConfirmationRepair.name', 'Parker confirmation interruption repair'),
        detail: copy('experiments.parkerConfirmationRepair.detail', 'A synthetic none-of-these rejection now cancels the exact read-back target, clears stale yes context, and requests a fresh restatement without executing or sending anything.'),
        status: copy('experiments.parkerConfirmationRepair.status', 'open PR / synthetic eval green'),
        linkLabel: copy('experiments.parkerConfirmationRepair.link', 'Read the confirmation repair note'),
      },
    ],
  },
  {
    index: '03',
    title: 'Parker scheduled-wrapper boundary',
    href: '/work/parker-wrapper-boundary/',
    status: 'Open PR / inactive harness green',
    summary: 'A same-account non-root worker now exercises the scrubbed launch, temporary ownership checks, timeout, and output limits without activating the scheduler.',
    receipt: ['9 / 9 inactive checks', '668 / 668 full tests', '0 live activations'],
    limit: 'PR 21 is open, unmerged, and stacked. No separate OS identities, detached-descendant containment, genuine scheduled receipt, product result, or clinical evidence.',
    surfaces: ['Public pull request', 'Exact harness', 'Behavior tests', 'Hosted run', 'Live route'],
    provenance: {
      kind: 'public',
      verifiedOn: '2026-07-17',
      label: 'Exact inactive harness',
      href: 'https://github.com/prasithg/parker/blob/a862de4aa2366aef506c35d280a59d9d3ce0c951/benchmark/scheduled_wrapper_harness_v0.py',
    },
    homepageRows: [
      {
        order: 10,
        time: 'Jul 2026',
        name: copy('experiments.parkerWrapperBoundary.name', 'Parker inactive wrapper boundary'),
        detail: copy('experiments.parkerWrapperBoundary.detail', 'A synthetic scheduled-wrapper contract now launches one bounded same-account worker, checks temporary state through trusted descriptors, and fails closed on timeout or output overflow.'),
        status: copy('experiments.parkerWrapperBoundary.status', 'open PR / inactive harness green'),
        linkLabel: copy('experiments.parkerWrapperBoundary.link', 'Read the wrapper boundary note'),
      },
    ],
  },
  {
    index: '04',
    title: 'Harness Delta',
    href: '/work/harness-delta/',
    status: 'Abstained / cleanup fails closed',
    summary: 'A matched agent evaluation that stopped on isolation and parity, then made uncertain timeout or overflow cleanup an explicit pre-model blocker.',
    receipt: ['0 model runs', '23 / 23 harness tests', 'Cleanup unconfirmed becomes exit 126'],
    limit: 'No model comparison ran. Same-UID isolation, runtime parity, cross-platform behavior, and independent final review remain blocked. There is no winner, ranking, or score.',
    surfaces: ['Field note', 'Machine receipt', 'Live route'],
    provenance: {
      kind: 'local',
      verifiedOn: '2026-07-17',
      boundary: 'Local-only evidence. No public source revision exists.',
    },
    homepageRows: [
      {
        order: 50,
        time: 'Jul 2026',
        name: copy('experiments.harnessProbes.name', 'Fail-closed Harness probe cleanup'),
        detail: copy('experiments.harnessProbes.detail', 'Timeout and overflow now count as ordinary probe results only after the owned process group is observed gone; uncertain cleanup becomes an exit 126 hard blocker.'),
        status: copy('experiments.harnessProbes.status', 'local control / zero model runs'),
        linkLabel: copy('experiments.harnessProbes.link', 'Read the bounded abstention note'),
      },
      {
        order: 110,
        time: 'Jul 2026',
        name: copy('experiments.harnessDelta.name', 'Harness Delta'),
        detail: copy('experiments.harnessDelta.detail', 'A matched agent eval that stopped at the isolation and parity gates before either model ran.'),
        status: copy('experiments.harnessDelta.status', 'abstained / verified'),
        linkLabel: copy('experiments.harnessDelta.link', 'Read the abstention note'),
      },
    ],
  },
  {
    index: '05',
    title: 'CDP download-policy ownership',
    href: '/work/cdp-download-policy/',
    status: 'Local experiment / live browser',
    summary: 'Two browser-level CDP clients showed that a default-context download policy can change while the owner session stays connected.',
    receipt: ['10 / 10 evaluator tests', '1 quarantined synthetic canary', 'Chrome for Testing 151'],
    limit: 'Canary-based detection happens after a synthetic effect. No public implementation, direct policy readback, extension parity, or production proof.',
    surfaces: ['Field note', 'Local machine receipt', 'Live route'],
    provenance: {
      kind: 'local',
      verifiedOn: '2026-07-17',
      boundary: 'Local-only evidence. No public source revision exists.',
    },
    homepageRows: [
      {
        order: 40,
        time: 'Jul 2026',
        name: copy('experiments.cdpPolicyOwner.name', 'CDP download-policy ownership'),
        detail: copy('experiments.cdpPolicyOwner.detail', 'Two browser clients shared one default-context download policy. A bounded synthetic canary caught the sibling mutation and the owner restored deny.'),
        status: copy('experiments.cdpPolicyOwner.status', 'local live-browser control'),
        linkLabel: copy('experiments.cdpPolicyOwner.link', 'Read the browser policy note'),
      },
    ],
  },
  {
    index: '06',
    title: 'Descriptor-relative storage accounting',
    href: '/work/descriptor-storage/',
    status: 'Local operations / verified',
    summary: 'An overnight scratch scanner that opens every child relative to trusted descriptors and carries one global file, entry, and byte budget.',
    receipt: ['8 / 8 storage controls', '109 / 109 project tests', '611,856-byte live inventory'],
    limit: 'Point-in-time metadata only. No authenticated snapshot, hosted replay, public source revision, recovery authority, or independent review.',
    surfaces: ['Field note', 'Local machine receipt', 'Live inventory'],
    provenance: {
      kind: 'local',
      verifiedOn: '2026-07-17',
      boundary: 'Local-only evidence. No public source revision exists.',
    },
    homepageRows: [
      {
        order: 20,
        time: 'Jul 2026',
        name: copy('experiments.descriptorStorage.name', 'Descriptor-relative scratch accounting'),
        detail: copy('experiments.descriptorStorage.detail', 'The overnight storage guard now opens the root and every child through trusted descriptors, rejects replacement races, and carries one global file, entry, and byte budget.'),
        status: copy('experiments.descriptorStorage.status', 'local operations / verified'),
        linkLabel: copy('experiments.descriptorStorage.link', 'Read the bounded storage note'),
      },
    ],
  },
  {
    index: '07',
    title: 'Personal site release pipeline',
    href: '/work/release-pipeline/',
    status: 'Deployed / verified',
    summary: 'The local, hosted, Pages, and live-browser gates used to move one site revision from source to the verified GitHub Pages surface.',
    receipt: ['4 ordered gates', '22 / 22 site tests', '1 matching revision'],
    limit: 'Custom domain remains excluded. The verified host is prasithg.github.io.',
    surfaces: ['Public source', 'Hosted run', 'Live route'],
    provenance: {
      kind: 'public',
      verifiedOn: '2026-07-16',
      label: 'Verified release-note source',
      href: 'https://github.com/prasithg/prasithg.github.io/blob/2b3896448db675a2f09d313b107c19dd17ef340d/src/pages/work/release-pipeline.astro',
    },
    homepageRows: [
      {
        order: 100,
        time: 'Jul 2026',
        name: copy('experiments.site.name', 'Personal site release pipeline'),
        detail: copy('experiments.site.detail', 'Astro, agent-driven, with a gated GitHub Pages deployment target.'),
        status: copy('experiments.site.status', 'local gate / green'),
        linkLabel: copy('experiments.site.link', 'Read the release note'),
      },
    ],
  },
  {
    index: '08',
    title: 'Downstream contracts',
    href: '/work/downstream-contracts/',
    status: 'Open PRs / CI green',
    summary: 'Two OSS contracts installed from exact commits in a separate same-owner repository, with failure behavior tested before export and append.',
    receipt: ['10 / 10 consumer controls', '4 hosted validations', '28 / 28 site tests'],
    limit: 'Both pull requests remain open. Outside adoption remains unproven.',
    surfaces: ['Public source', 'Consumer pull requests', 'Live route'],
    provenance: {
      kind: 'public',
      verifiedOn: '2026-07-16',
      label: 'Exact producer revision',
      href: 'https://github.com/prasithg/agent-knowledge-boundary-contracts/commit/52bbea3cfde10f60e78c7c74e82dee00e7dcc6ba',
    },
    homepageRows: [
      {
        order: 80,
        time: 'Jul 2026',
        name: copy('experiments.downstreamContracts.name', 'Downstream contract checks'),
        detail: copy('experiments.downstreamContracts.detail', 'Two pinned OSS contracts wired into a separate consumer repository with fail-closed controls.'),
        status: copy('experiments.downstreamContracts.status', 'open PRs / CI green'),
        linkLabel: copy('experiments.downstreamContracts.link', 'Read the consumer note'),
      },
    ],
  },
  {
    index: '09',
    title: 'Attested scheduler identity',
    href: '/work/attested-scheduler/',
    status: 'Open PR / attested run',
    summary: 'A metadata-only GitHub Actions run identity signed through OIDC and Sigstore, then checked against exact workflow and source policy.',
    receipt: ['1 verified attestation', '3 hosted checks', '40 / 40 site tests'],
    limit: 'Pull request event only. No schedule-event coverage, recovery authority, merge, or independent model review.',
    surfaces: ['Public pull request', 'Hosted run', 'Live route'],
    provenance: {
      kind: 'public',
      verifiedOn: '2026-07-16',
      label: 'Exact attestation source revision',
      href: 'https://github.com/prasithg/claude-desktop-supervisor/commit/80b1831d9eabca027ef7322143fc3a3523d06869',
    },
    homepageRows: [
      {
        order: 70,
        time: 'Jul 2026',
        name: copy('experiments.attestedScheduler.name', 'Attested scheduler identity'),
        detail: copy('experiments.attestedScheduler.detail', 'A metadata-only GitHub Actions run identity bound to an exact workflow and source digest through OIDC and Sigstore.'),
        status: copy('experiments.attestedScheduler.status', 'open PR / attested run'),
        linkLabel: copy('experiments.attestedScheduler.link', 'Read the attestation note'),
      },
    ],
  },
  {
    index: '10',
    title: 'Native Windows owner contract',
    href: '/work/native-windows-owner/',
    status: 'Open PR / native CI green',
    summary: 'The isolated Hermes owner producer and independent auditor replayed together on a GitHub-hosted Windows 2025 worker.',
    receipt: ['4 / 4 native controls', '1 downloaded artifact', '46 / 46 site tests'],
    limit: 'Pull request event only. No schedule-event coverage, merge, recovery authority, or independent model review.',
    surfaces: ['Public pull request', 'Windows hosted run', 'Live route'],
    provenance: {
      kind: 'public',
      verifiedOn: '2026-07-16',
      label: 'Exact Windows source revision',
      href: 'https://github.com/prasithg/claude-desktop-supervisor/commit/2fd0f4767e8f7974192da3e310c20662b7514e8c',
    },
    homepageRows: [
      {
        order: 60,
        time: 'Jul 2026',
        name: copy('experiments.nativeWindowsOwner.name', 'Native Windows owner contract'),
        detail: copy('experiments.nativeWindowsOwner.detail', 'The same metadata-only scheduler-owner producer and auditor replayed on a GitHub-hosted Windows 2025 worker.'),
        status: copy('experiments.nativeWindowsOwner.status', 'open PR / native CI green'),
        linkLabel: copy('experiments.nativeWindowsOwner.link', 'Read the Windows parity note'),
      },
    ],
  },
] as const satisfies readonly EvidenceNote[];
