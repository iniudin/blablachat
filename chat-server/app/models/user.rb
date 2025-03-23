class User < ApplicationRecord
  has_secure_password
  has_secure_token :auth_token

  has_many :room_members
  has_many :rooms, through: :room_members
  has_many :messages


  validates :name, presence: true, uniqueness: true
end
