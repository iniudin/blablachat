class Room < ActiveRecord::Migration[8.0]
  def change
    create_table :rooms do |t|
      t.string :name, null: false
      t.boolean :private, default: false
      t.references :owner, null: false, foreign_key: true

      t.timestamps
    end
  end
end
