import { useEffect, useRef } from "react";

interface AboutModalProps {
  onClose: () => void;
}

export function AboutModal({ onClose }: AboutModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dialogRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="about-modal__backdrop" onClick={onClose}>
      <div
        ref={dialogRef}
        className="about-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-modal-heading"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="about-modal__header">
          <h2 id="about-modal-heading">About this app</h2>
          <button
            type="button"
            className="about-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className="about-modal__body">
          <h3>What is this?</h3>
          <p>
            A simple nutrition calculator for Cook Out&rsquo;s menu. Cook Out publishes its
            nutrition information as a PDF rather than an interactive tool, so this project
            parses that PDF into structured, machine-readable data and uses it to power this
            app &mdash; the kind of nutrition calculator you&rsquo;d expect from a big national
            chain, built here for a regional one.
          </p>

          <h3>What is Cook Out?</h3>
          <p>
            Cook Out is a regional fast food chain founded in Greensboro, North Carolina in
            1989. It has since grown across most of the southeastern United States and beyond,
            with over 350 locations. It&rsquo;s a longtime late-night favorite in North
            Carolina, best known for its Fancy Milkshakes and the &ldquo;Cook Out Tray&rdquo;
            &mdash; a combo of one main entr&eacute;e, two sides (anything from fries to corn
            dogs to quesadillas), and a drink or milkshake.
          </p>
        </div>
      </div>
    </div>
  );
}
