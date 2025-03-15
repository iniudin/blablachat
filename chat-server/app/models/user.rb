class User < ApplicationRecord
  has_secure_password
  has_secure_token :auth_token

  has_many :messages
  has_many :owned_rooms, class_name: 'Room', foreign_key: 'owner_id'
  has_many :room_members
  has_many :rooms, through: :room_members

  validates :name, presence: true, uniqueness: true
end
