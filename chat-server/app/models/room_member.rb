class RoomMember < ApplicationRecord
  belongs_to :room
  belongs_to :user

  validates :user_id, :room_id, presence: true
  validates :role, inclusion: { in: %w[member admin] }
  validates :room_id, uniqueness: { scope: :user_id }
end
