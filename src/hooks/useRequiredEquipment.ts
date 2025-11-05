import { useEventEquipment } from "@/hooks/useEventEquipment";
import { REQUIRED_EQUIPMENT_CATEGORIES } from "@/constants/equipment";

export const useRequiredEquipment = (eventId?: string) => {
  const { data: eventEquipment = [] } = useEventEquipment(eventId);
  
  const validationResults = REQUIRED_EQUIPMENT_CATEGORIES.map(required => {
    const allocatedEquipment = eventEquipment.filter(
      item => item.equipment?.category === required.category &&
              item.status !== 'retornado'
    );
    
    const hasRequired = allocatedEquipment.length >= required.quantity;
    
    return {
      category: required.category,
      label: required.label,
      required: required.quantity,
      allocated: allocatedEquipment.length,
      hasRequired,
      equipment: allocatedEquipment
    };
  });
  
  const allRequirementsMet = validationResults.every(r => r.hasRequired);
  const missingEquipment = validationResults.filter(r => !r.hasRequired);
  
  return {
    validationResults,
    allRequirementsMet,
    missingEquipment
  };
};
