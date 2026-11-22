import type { ScrollItem } from "@/data/bookcase";
import Tooltip, { placeTip } from "./Tooltip";

// The scroll box: a wooden case of 2 x 2 square cubbies, with rolled scrolls slid in and seen end-on
// (a ring of rolled paper around a dark hollow, with a twine tie), like a pigeonhole rack of scrolls.

export const CELL = 80;  // inside of one cubby, px
const WALL = 7;          // wood between and around the cubbies
const PER_CELL = 4;      // scrolls a cubby holds before the next box starts
export const PER_BOX = PER_CELL * 4;
export const BOX_W = CELL * 2 + WALL * 3;

/** Where the scrolls in one cubby rest: on the floor first, then stacked on top. Centres, in px. */
function spots(n: number): [number, number][] {
  const floor = CELL - 21, upper = floor - 31;
  if (n === 1) return [[CELL / 2, floor]];
  if (n === 2) return [[CELL * 0.29, floor], [CELL * 0.71, floor]];
  if (n === 3) return [[CELL * 0.29, floor], [CELL * 0.71, floor], [CELL / 2, upper]];
  return [[CELL * 0.29, floor], [CELL * 0.71, floor], [CELL * 0.31, upper], [CELL * 0.69, upper]];
}

/** Rolled paper seen end-on: a large dark hollow, a thin wall of aged parchment wound in a few turns,
 *  and the seam where the paper's outer edge spirals in. */
const PAPER =
  "conic-gradient(from 200deg at 52% 47%, transparent 0 351deg, rgba(74, 50, 26, .55) 351deg 360deg), " +
  "radial-gradient(circle at 52% 47%, #0f0904 0 38%, #3d2c1b 39% 41%, #d7c299 42% 52%, #ad9267 53% 54%, " +
  "#e4d2ac 55% 67%, #b39a6d 68% 69%, #e9d8b4 70% 84%, #bea47a 85% 87%, #dcc8a0 88% 100%)";

function ScrollEnd({ s, x, y, onOpen }: { s: ScrollItem; x: number; y: number; onOpen: (el: HTMLElement) => void }) {
  const d = Math.min(s.d, 44);
  return (
    <button
      type="button"
      onMouseEnter={placeTip}
      onFocus={placeTip}
      onClick={(e) => onOpen(e.currentTarget)}
      aria-label={`Open ${s.tip[0]}`}
      className="scroll-end group absolute"
      style={{ left: x - d / 2, top: y - d / 2, width: d, height: d, background: PAPER }}
    >
      {/* twine, tied round the roll and hanging off its edge */}
      <span aria-hidden className="absolute pointer-events-none" style={{
        right: -5, bottom: -7, width: 12, height: 14, borderRadius: "50%",
        border: `1.5px solid ${s.edge}`, borderTopColor: "transparent", borderLeftColor: "transparent", opacity: 0.85,
      }} />
      <Tooltip tip={s.tip} />
    </button>
  );
}

function Box({ scrolls, onOpen }: { scrolls: ScrollItem[]; onOpen: (s: ScrollItem, el: HTMLElement) => void }) {
  // deal the scrolls round the four cubbies, so a few scrolls spread out rather than crowd one
  const cells: ScrollItem[][] = [[], [], [], []];
  scrolls.forEach((s, i) => cells[i % 4].push(s));
  return (
    <div className="scroll-box flex-shrink-0" style={{ width: BOX_W, padding: WALL, gap: WALL }} aria-label="Scrolls">
      {cells.map((cell, c) => (
        <div key={c} className="scroll-cell relative" style={{ width: CELL, height: CELL }}>
          {spots(cell.length).map(([x, y], i) => (
            <ScrollEnd key={cell[i].tip[0]} s={cell[i]} x={x} y={y} onOpen={(el) => onOpen(cell[i], el)} />
          ))}
        </div>
      ))}
    </div>
  );
}

/** One box per 16 scrolls. */
export default function ScrollBoxes({ scrolls, onOpen }: { scrolls: ScrollItem[]; onOpen: (s: ScrollItem, el: HTMLElement) => void }) {
  const boxes: ScrollItem[][] = [];
  for (let i = 0; i < scrolls.length; i += PER_BOX) boxes.push(scrolls.slice(i, i + PER_BOX));
  return (
    <div className="flex items-end gap-2 flex-shrink-0 mx-2">
      {boxes.map((b, i) => <Box key={i} scrolls={b} onOpen={onOpen} />)}
    </div>
  );
}
