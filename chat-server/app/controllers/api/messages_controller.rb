class Api::MessagesController < ApplicationController
  before_action :set_room
  before_action :authorize_room_access

  def index
    page = params[:page] || 1
    per_page = params[:per_page] || 20
    @messages = @room.messages.includes(:user).order(created_at: :desc).page(page).per(per_page)
    render json: @messages.reverse.as_json(include: { user: { only: [:id, :name] } }, except: [:user_id, :room_id]), status: :ok
  end

  def create
    @message = @room.messages.build(message_params)
    @message.user = current_user
    if @message.save
      RoomChannel.broadcast_to(@room,{
        type: "NEW_MESSAGE",
        message: @message.as_json(include: { user: { only: [:id, :name] } }, except: [:user_id, :room_id])
      })
      render json: @message.as_json(include: { user: { only: [:id, :name] } }, except: [:user_id, :room_id]), status: :created
    else
      render json: { error: @message.errors.full_messages.join(", ") }, status: :unprocessable_entity
    end
  end

  private

  def set_room
    @room = Room.find(params[:room_id])
  end

  def authorize_room_access
    unless @room.public || @room.users.include?(current_user)
      render json: { error: "Access denied" }, status: :forbidden
    end
  end

  def message_params
    params.permit(:content)
  end
end
