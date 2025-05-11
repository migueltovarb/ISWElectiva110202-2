from dataclasses import dataclass
from typing import Optional

@dataclass
class Alarm:
    id: int
    name: str
    status: str  # "active", "inactive", "triggered"
    location: str

    def is_active(self) -> bool:
        return self.status.lower() == "active"

    def trigger(self, user: 'User', door_id: int) -> Optional[str]:
        if not any(door.id == door_id for door in user.doors):
            self.status = "triggered"
            return f"Access denied. Alarm triggered for Door ID {door_id}."
        return None

    def reset(self) -> None:
        self.status = "inactive"
