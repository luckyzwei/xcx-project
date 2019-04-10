-- 机器人
create table if not exists robot
(
  id uuid not null constraint robot_pkey primary key,
  code varchar(255) default NULL::character varying,
  name varchar(255) default NULL::character varying,
  count_threshold bigint,
  count_distribute bigint,
  head_url varchar(255) default NULL::character varying,
  qr_code varchar(255) default NULL::character varying,
  wechat_no varchar(255) default NULL::character varying,
  status smallint default 1,
  create_date timestamp(3) default CURRENT_TIMESTAMP not null,
  update_date timestamp(3) default CURRENT_TIMESTAMP not null
);
comment on table robot is '群宠机器人';
comment on column robot.code is '机器人编码，由wxId经过md5加密所得';
comment on column robot.name is '机器人名称';
comment on column robot.count_threshold is '可分配数量';
comment on column robot.count_distribute is '已分配数量';
comment on column robot.head_url is '头像';
comment on column robot.qr_code is '机器人二维码路径';
comment on column robot.wechat_no is '微信账号';
comment on column robot.status is '1-参与分配 2-不参与分配 3-删除';
create index if not exists idx_robot_code on robot (code);

-- 群
create table if not exists "group"
(
  id uuid not null constraint group_pkey primary key,
  code varchar(255) default NULL::character varying,
  user_id uuid,
  user_code varchar(255) default NULL::character varying,
  owner_user_code varchar(255) default NULL::character varying,
  name varchar(255) default NULL::character varying,
  mem_count smallint,
  ad_monitor_msg varchar(500) default NULL::character varying,
  ad_monitor_msg_switch smallint default 0,
  welcome_msg varchar(500) default NULL::character varying,
  welcome_msg_switch smallint default 0,
  status smallint default 0,
  cancel_reason smallint,
  create_date timestamp default CURRENT_TIMESTAMP,
  update_date timestamp default CURRENT_TIMESTAMP
);
comment on table "group" is '群宠群';
comment on column "group".code is '群编码';
comment on column "group".user_id is 'user_id';
comment on column "group".user_code is '拉群用户code';
comment on column "group".owner_user_code is '群主用户code';
comment on column "group".name is '群名';
comment on column "group".mem_count is '群成员数量';
comment on column "group".ad_monitor_msg is '广告监测回复话术';
comment on column "group".ad_monitor_msg_switch is '广告监测开关, 0-关 1-开';
comment on column "group".welcome_msg is '群欢迎语';
comment on column "group".welcome_msg_switch is '群欢迎语开关, 0-关 1-开';
comment on column "group".status is '1-正常 3-删除';
comment on column "group".cancel_reason is '退群原因';
create index if not exists idx_group_code on "group" (code);
create index if not exists idx_group_owner_code on "group" (owner_user_code);
create index if not exists idx_group_userid on "group" (user_id);

-- 机器人群关联表
create table if not exists robot_group_map
(
  id uuid not null constraint robot_group_map_pkey primary key,
  robot_id uuid,
  group_id uuid,
  nickname varchar(128) default NULL::character varying,
  status smallint default 1,
  create_date timestamp(3) default CURRENT_TIMESTAMP,
  update_date timestamp(3) default CURRENT_TIMESTAMP
);
comment on column robot_group_map.robot_id is '机器人id';
comment on column robot_group_map.group_id is '机器人所在群id';
comment on column robot_group_map.nickname is '机器人群内显示昵称';
comment on column robot_group_map.status is '机器人和群的关联关系状态，1-正常 3-删除';
create index if not exists idx_rgm_group_id on robot_group_map (group_id);
create index if not exists idx_rgm_robot_id on robot_group_map (robot_id);

-- 机器人分配表
create table if not exists robot_distribute
(
  id uuid not null constraint robot_distribute_pkey primary key,
  robot_id uuid,
  user_id uuid,
  user_code varchar(255) default NULL::character varying,
  distribute_count smallint,
  used_count smallint default 0,
  status smallint default 1,
  create_date timestamp(3) default CURRENT_TIMESTAMP,
  update_date timestamp(3) default CURRENT_TIMESTAMP
);
comment on table robot_distribute is '机器人分配记录';
comment on column robot_distribute.user_code is '已使用导群数量';
comment on column robot_distribute.distribute_count is '分配导群数量';
create index if not exists idx_robot_dis_userid on robot_distribute (user_id);

-- 机器人好友表
create table if not exists robot_add_friend
(
  id uuid not null constraint robot_add_friend_pkey primary key,
  robot_id uuid,
  user_id uuid,
  status smallint default 1,
  create_date timestamp(3) default CURRENT_TIMESTAMP not null,
  update_date timestamp(3) default CURRENT_TIMESTAMP not null
);
comment on table robot_add_friend is '机器人加好友记录';
create index if not exists idx_r_add_f_userid on robot_add_friend (user_id);

-- 用户通过机器人邀请入群表
create table if not exists user_into_group
(
  id uuid not null constraint user_into_group_pkey primary key,
  invite_user_id uuid,
  user_id uuid,
  group_id uuid,
  robot_id uuid,
  status smallint default 1,
  create_date timestamp(3) default CURRENT_TIMESTAMP not null,
  update_date timestamp(3) default CURRENT_TIMESTAMP not null
);
comment on table user_into_group is '被机器人邀请入群记录';
comment on column user_into_group.invite_user_id is '理解为邀请入群者，同群的导入者';
comment on column user_into_group.user_id is '被邀请入群的用户';
comment on column user_into_group.group_id is '被邀请入的群';
comment on column user_into_group.robot_id is '激活该群的机器人';
create index if not exists idx_u_into_g_userid on user_into_group (user_id);

-- 用户表
create table if not exists "user"
(
  id uuid not null constraint user_pkey primary key,
  code varchar(255) default NULL::character varying,
  union_id char(28) default NULL::bpchar,
  head_url varchar(255) default NULL::character varying,
  nickname varchar(255) default NULL::character varying,
  phone varchar(32) default NULL::character varying,
  status smallint default 1,
  create_date timestamp(3) default CURRENT_TIMESTAMP not null,
  update_date timestamp(3) default CURRENT_TIMESTAMP not null
);
comment on column "user".code is '冗余字段，用户对应微信code(理解为mem code)';
comment on column "user".union_id is '微信union_id';
comment on column "user".head_url is '微信头像';
comment on column "user".nickname is '微信昵称';
comment on column "user".phone is '手机号';
comment on column "user".status is '1-正常 2封号';
create index if not exists idx_user_code on "user" (code);
create index if not exists idx_user_unionid on "user" (union_id);
