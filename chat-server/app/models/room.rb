class Room < ApplicationRecord
  before_create :generate_invite_code

  has_many :room_members, dependent: :destroy
  has_many :users, through: :room_members
  has_many :messages, dependent: :destroy

  validates :name, presence: true
  validates :invite_code, uniqueness: true
  validates :public, inclusion: { in: [true, false] }

  private

  def generate_invite_code
    self.invite_code = SecureRandom.hex(6)
  end
end
