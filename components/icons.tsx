import Ionicons from '@expo/vector-icons/Ionicons'

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
