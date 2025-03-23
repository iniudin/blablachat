class RoomMember < ActiveRecord::Migration[8.0]
  def change
    create_table :room_members do |t|
      t.references :room, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.string :role, default: "member"

      t.timestamps
    end

    add_index :room_members, [:room_id, :user_id], unique: true
    
  end
end
