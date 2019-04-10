import os

from sanic import Blueprint

from app import views, temp_views
from app.constants import BASIC_PATH

bp = Blueprint('dog_blueprint')
bp.add_route(views.robot_distribution_view, '/robot/distribution')
bp.add_route(views.group_forever_qrcode_view, '/group/<group_code:[a-z-A-Z-0-9\\-]+>/qrcode')
bp.add_route(views.group_robot_show_view, '/group/<group_code:[a-z-A-Z-0-9\\-]+>/robot_qrcode')

bp.add_route(views.get_user_status_view, '/user/status')
bp.add_route(views.group_welcome_msg_view, '/groups/welcome_msg')
bp.add_route(views.update_group_welcome_msg_view, '/group/<group_id:[a-zA-Z0-9\\-]+>/welcome_msg', methods=['PUT'])


bp.add_route(views.wechat_app_user_info_view, '/wechat/app/user_info', methods=['POST'])
bp.add_route(views.wechat_h5_user_info_view, '/wechat/h5/user_info')
bp.add_route(views.wechat_h5_js_ticket_view, '/wechat/h5/js/ticket')
bp.add_route(views.wechat_customer_msg_verify_view, '/wechat/customer/msg/verify')
bp.add_route(views.wechat_customer_msg_callback_view, '/wechat/customer/msg/verify', methods=['POST'])


bp.add_route(views.group_ad_monitor_msg_view, '/groups/ad_monitor')
bp.add_route(views.update_group_ad_monitor_msg_view, '/group/<group_id:[a-zA-Z0-9\\-]+>/ad_monitor', methods=['PUT'])

bp.add_route(views.get_feedback_view, '/feedback')

# ========== 临时url ========== #

bp.add_route(temp_views.distrubute_robot_view, '/temp/wechat/distribute')
bp.add_route(temp_views.temp_wechat_h5_user_info_view, '/temp/wechat/h5/user_info')
bp.add_route(temp_views.isregister_view, '/temp/users/<union_id:[a-zA-Z0-9\\_-]+>/registered')
bp.add_route(temp_views.complete_user_view, '/temp/user/complete', methods=['POST'])
bp.add_route(temp_views.user_groups_view, '/temp/user/<union_id:[a-zA-Z0-9\\_-]+>/groups')
bp.add_route(temp_views.modify_group_robot_nickname_view, '/temp/group/robot_name', methods=['POST'])
bp.add_route(temp_views.get_labels_view, '/temp/labels')
bp.add_route(temp_views.get_ads_view, '/temp/ads', methods=['POST'])
bp.add_route(temp_views.get_group_name, '/temp/group/name')
bp.add_route(temp_views.get_ad_data, '/temp/ads')
bp.add_route(temp_views.get_group_robot_name, '/temp/group/robot/nickname')


# 前端静态路径
bp.add_route(views.static_group_qrcode_view, '/group-robot-qrcode')
bp.add_route(views.static_robot_qrcode_view, '/robot-qrcode')
bp.add_route(views.static_error_page_one_view, '/error-page-one')
bp.add_route(views.static_error_page_two_view, '/error-page-two')
bp.add_route(views.static_images_show_view, '/static/image/<path:path>')

bp.add_route(views.static_route, '/demo/<str>')
bp.add_route(views.temp_static_images_show_view, '/static/temp_image/<path:path>')
bp.static('/js', os.path.join(BASIC_PATH, 'static/gdogH5/js'))
bp.static('/css', os.path.join(BASIC_PATH, 'static/gdogH5/css'))
bp.static('/images', os.path.join(BASIC_PATH, 'static/gdogH5/images'))

# ========== 临时前端静态路径 ========== #
bp.static('/demo/static', os.path.join(BASIC_PATH, 'static/demo/build/static'))
bp.static('/demo/images', os.path.join(BASIC_PATH, 'static/demo/build/images'))
bp.static('/demo/css', os.path.join(BASIC_PATH, 'static/demo/build/css'))
