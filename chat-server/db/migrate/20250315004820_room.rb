class Room < ActiveRecord::Migration[8.0]
  def change
    create_table :rooms do |t|
      t.string :name, null: false
      t.boolean :public, default: true
      t.string :invite_code
      t.references :owner, null: false, foreign_key: true

      t.timestamps

      add_index :rooms, :invite_code, unique: true
    end
  end
end
