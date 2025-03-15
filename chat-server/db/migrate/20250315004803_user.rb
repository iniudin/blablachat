class User < ActiveRecord::Migration[8.0]
  def change
    create_table :users do |t|
      t.string :name, null: false
      t.string :password_digest, null: false
      t.string :auth_token
      t.timestamps
    end

    add_index :users, :name, unique: true
    add_index :users, :auth_token, unique: true

  end
end
