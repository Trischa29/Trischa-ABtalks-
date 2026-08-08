import { cn } from "../lib/cn";

const CREDITS = {
  city: {
    title: "Cyberpunk City",
    url: "https://sketchfab.com/3d-models/cyberpunk-city-3f24e5c5bf924f46b30d9a392afa9624",
    author: "mortalityrexotable",
    authorUrl: "https://sketchfab.com/mortalityrexotable",
    license: "CC-BY-4.0",
    licenseUrl: "http://creativecommons.org/licenses/by/4.0/",
  },
  laptop: {
    title: "CyberPunk Laptop Concept Design",
    url: "https://sketchfab.com/3d-models/cyberpunk-laptop-concept-design-fddc4e68cc6c498b88b19af1a05bd420",
    author: "Berk Gedik",
    authorUrl: "https://sketchfab.com/berkgedik",
    license: "CC-BY-4.0",
    licenseUrl: "http://creativecommons.org/licenses/by/4.0/",
  },
  drone: {
    title: "Sci-Fi Drone",
    url: "https://sketchfab.com/3d-models/sci-fi-drone-f274858136554110ab60d7f30d0c24b8",
    author: "Elinor Quittner",
    authorUrl: "https://sketchfab.com/elqui",
    license: "CC-BY-NC-SA-4.0",
    licenseUrl: "http://creativecommons.org/licenses/by-nc-sa/4.0/",
  },
};

const linkClass = "underline decoration-dotted underline-offset-2 hover:text-[var(--color-ink-dim)]";

export default function ModelCredit({ ids, className }) {
  return (
    <p className={cn("font-mono text-[10px] leading-relaxed text-[var(--color-ink-faint)]", className)}>
      {ids.map((id, i) => {
        const c = CREDITS[id];
        return (
          <span key={id}>
            {i > 0 && " · "}"
            <a href={c.url} target="_blank" rel="noreferrer noopener" className={linkClass}>
              {c.title}
            </a>
            " by{" "}
            <a href={c.authorUrl} target="_blank" rel="noreferrer noopener" className={linkClass}>
              {c.author}
            </a>
            ,{" "}
            <a href={c.licenseUrl} target="_blank" rel="noreferrer noopener" className={linkClass}>
              {c.license}
            </a>
          </span>
        );
      })}
    </p>
  );
}
