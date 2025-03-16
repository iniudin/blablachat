class Room < ApplicationRecord
  belongs_to :owner, class_name: 'User'
  has_many :room_members, dependent: :destroy
  has_many :users, through: :room_members
  has_many :messages, dependent: :destroy

  validates :name, presence: true
  validates :invite_code, uniqueness: true
  validates :public, inclusion: { in: [true, false] }
end
