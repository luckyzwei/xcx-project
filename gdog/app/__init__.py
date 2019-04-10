from sanic import Sanic
from sanic_cors import CORS
from sanic_jwt import Initialize

from app.authenticate import CustomAuthentication, CustomerResponses
from app.base import db, redis, sanic_mq, inner_mq, csa
from app.urls import bp as bp_dog


def create_app(settings):
    app = Sanic(__name__, log_config=settings['LOGGING_CONFIG_FILE_HANDLER'])
    CORS(app, automatic_options=True)
    app.config.update(**settings)
    app.config.update({'LOGO': None})
    app.blueprint(bp_dog)

    from app.receiver import on_message_common, on_ad_message
    from app.temp_receiver import temp_ad_on_message_commom

    @app.listener('before_server_start')
    async def before_server_start(_app, _loop):
        _app.db = await db.init_app(_loop, _app.config['DATABASES'])
        _app.redis = redis.init_app(_loop, _app.config['REDIS'])
        _app.client_session = csa.init_session(loop=_loop)
        # gbot mq connect
        _app.mq = await sanic_mq.init_app(_loop, _app.config['MQ_CONFIG'])
        await sanic_mq.channel()
        await sanic_mq.exchange('gemii.gbot.topic')
        await sanic_mq.bind_async_receiver('queue.bot.common.dog', 'queue.bot.common.dog', on_message_common)
        await sanic_mq.bind_async_receiver('queue.bot.common.temp_ad', 'queue.bot.common.temp_ad', temp_ad_on_message_commom)

        # gdog mq connect
        _app.inner_mq = await inner_mq.init_app(_loop, _app.config['INNER_MQ_CONFIG'])
        await inner_mq.channel()
        await inner_mq.exchange('gemii.gdog.topic')
        await inner_mq.bind_async_receiver('queue.rs.msg_class', 'queue.rs.msg_class', on_ad_message)

    @app.listener('after_server_stop')
    async def after_server_stop(_app, _loop):
        await _app.client_session.close()
        await _app.db.close()
        _app.redis.connection_pool.disconnect()
        await sanic_mq.disconnection()

    Initialize(app,
               authentication_class=CustomAuthentication,
               responses_class=CustomerResponses,
               refresh_token_enabled=False,
               secret=settings['JWT_SECRET'],
               expiration_delta=1*60*60)
    return app
