/**
 * React island: switches the accent colour between vanadium's oxidation states.
 * Logic comes with the styles step.
 */
import { oxidationStates } from '@/data/site';

export default function OxidationSwitcher() {
  return (
    <div>
      {oxidationStates.map((state) => (
        <button key={state.id} type="button">
          {state.label}
        </button>
      ))}
    </div>
  );
}
