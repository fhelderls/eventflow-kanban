import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { EventCard } from './EventCard';
import { Event } from '@/hooks/useEvents';

interface DraggableEventCardProps {
  event: Event;
  onClick?: (event: Event) => void;
}

export const DraggableEventCard = ({ event, onClick }: DraggableEventCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: event.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <EventCard event={event} onClick={onClick} />
    </div>
  );
};
