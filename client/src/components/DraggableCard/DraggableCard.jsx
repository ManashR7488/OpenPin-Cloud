// components/DraggableCard.jsx
import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

export default function DraggableCard({ id, index, moveCard, children }) {
  const ref = useRef(null);

  // Source: this item can be dragged
  const [, drag] = useDrag({
    type: "CARD",
    item: { id, index },
  });

  // Target: this item can be dropped on
  const [, drop] = useDrop({
    accept: "CARD",
    hover(item) {
      if (item.index !== index) {
        moveCard(item.index, index);
        item.index = index;
      }
    },
  });

  drag(drop(ref));
  return <div ref={ref}>{children}</div>;
}
