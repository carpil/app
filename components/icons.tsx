import Ionicons from '@expo/vector-icons/Ionicons'
import Feather from '@expo/vector-icons/Feather'

interface IconProps {
  color: string
}
export const CarIcon = ({ color }: IconProps) => (
  <Ionicons name="car" size={24} color={color} />
)

export const MessagesIcon = ({ color }: IconProps) => (
  <Ionicons name="chatbox" size={24} color={color} />
)

export const ProfileIcon = ({ color }: IconProps) => (
  <Ionicons name="person" size={24} color={color} />
)

export const AddIcon = ({ color }: IconProps) => (
  <Ionicons name="add" size={24} color={color} />
)

export const LocationIcon = ({ color }: IconProps) => (
  <Ionicons name="location-outline" size={24} color={color} />
)

export const MoreIcon = ({ color }: IconProps) => (
  <Feather name="more-vertical" size={24} color={color} />
)

export const EditIcon = ({ color }: IconProps) => (
  <Feather name="edit" size={24} color={color} />
)

export const UsersIcon = ({ color }: IconProps) => (
  <Feather name="users" size={24} color={color} />
)

export const MinusIcon = ({ color }: IconProps) => (
  <Feather name="minus" size={24} color={color} />
)

export const PlusIcon = ({ color }: IconProps) => (
  <Feather name="plus" size={24} color={color} />
)
