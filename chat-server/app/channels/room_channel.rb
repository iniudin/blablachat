class RoomChannel < ApplicationCable::Channel
  def subscribed
    @room = Room.find(params[:room_id])
    if @room.public || @room.users.include?(current_user)
      stream_for @room
      RoomChannel.broadcast_to(@room, { type: 'USER_JOINED', user: current_user.as_json(only: [:id, :name]) })
    else
      reject
    end
  end

  def unsubscribed
    if @room
      RoomChannel.broadcast_to(@room, { type: 'USER_LEFT', user: current_user.as_json(only: [:id, :name]) })
    end
  end

  def typing(data)
    RoomChannel.broadcast_to(@room, {
      type: 'TYPING',
      user: current_user.as_json(only: [:id, :name]),
      typing: data['typing']
    })
  end
end
