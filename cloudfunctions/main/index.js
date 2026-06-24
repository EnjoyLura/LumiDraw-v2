// 露米画板 - 主云函数（单入口路由）
const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command;

// ============ 工具函数 ============
function success(data) {
  return { code: 0, data, msg: 'ok' };
}
function fail(msg) {
  return { code: -1, data: null, msg };
}
function generateUserId() {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = 'LUMI';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// ============ 用户模块 ============
const userModule = {
  async login(openid) {
    try {
      const { data } = await db.collection('users').where({ openid }).get();
      if (data.length > 0) {
        return success(data[0]);
      }
      // 新用户注册
      const userId = generateUserId();
      const newUser = {
        openid,
        userId,
        nickName: '露米用户',
        avatarUrl: '',
        gender: '',
        signature: '',
        credits: 100,
        vipStatus: false,
        vipExpireDate: null,
        inviteCode: userId,
        isAdmin: false,
        bgImage: '',
        createTime: db.serverDate()
      };
      const res = await db.collection('users').add({ data: newUser });
      newUser._id = res._id;
      // 记录积分
      await db.collection('credits').add({
        data: {
          userId: openid,
          type: 'earn',
          amount: 100,
          source: '新用户注册',
          description: '注册赠送100积分',
          createTime: db.serverDate()
        }
      });
      return success(newUser);
    } catch (e) {
      return fail('登录失败: ' + e.message);
    }
  },

  async getProfile(openid, data) {
    try {
      const query = data.userId ? { userId: data.userId } : { openid };
      const { data: users } = await db.collection('users').where(query).get();
      if (users.length === 0) return fail('用户不存在');
      return success(users[0]);
    } catch (e) {
      return fail('获取信息失败: ' + e.message);
    }
  },

  async updateProfile(openid, data) {
    try {
      const updateData = {};
      if (data.nickName !== undefined) updateData.nickName = data.nickName;
      if (data.avatarUrl !== undefined) updateData.avatarUrl = data.avatarUrl;
      if (data.gender !== undefined) updateData.gender = data.gender;
      if (data.signature !== undefined) updateData.signature = data.signature;
      if (data.bgImage !== undefined) updateData.bgImage = data.bgImage;
      await db.collection('users').where({ openid }).update({ data: updateData });
      return success({ updated: true });
    } catch (e) {
      return fail('更新失败: ' + e.message);
    }
  }
};

// ============ 内容模块 ============
const contentModule = {
  async getBanners() {
    try {
      const { data } = await db.collection('banners')
        .where({ status: 'active' })
        .orderBy('sort', 'asc')
        .get();
      return success(data);
    } catch (e) {
      return fail('获取轮播图失败: ' + e.message);
    }
  },

  async getModels() {
    try {
      const { data } = await db.collection('models')
        .where({ enabled: true })
        .orderBy('sort', 'asc')
        .get();
      return success(data);
    } catch (e) {
      return fail('获取模型失败: ' + e.message);
    }
  },

  async getStyles() {
    try {
      const { data } = await db.collection('styles')
        .where({ enabled: true })
        .orderBy('sort', 'asc')
        .get();
      return success(data);
    } catch (e) {
      return fail('获取风格失败: ' + e.message);
    }
  },

  async getGameplays() {
    try {
      const { data } = await db.collection('gameplays')
        .where({ enabled: true })
        .orderBy('sort', 'asc')
        .get();
      return success(data);
    } catch (e) {
      return fail('获取玩法失败: ' + e.message);
    }
  },

  async getCategories() {
    try {
      const { data } = await db.collection('categories')
        .where({ enabled: true })
        .orderBy('sort', 'asc')
        .get();
      return success(data);
    } catch (e) {
      return fail('获取分类失败: ' + e.message);
    }
  }
};

// ============ 作品模块 ============
const workModule = {
  async create(openid, data) {
    try {
      const work = {
        userId: openid,
        imageUrls: data.imageUrls || [],
        prompt: data.prompt || '',
        model: data.model || '',
        ratio: data.ratio || '1:1',
        quality: data.quality || '1K',
        style: data.style || '',
        tags: data.tags || [],
        title: data.title || '',
        desc: data.desc || '',
        status: 'draft',
        likes: 0,
        favorites: 0,
        remakes: 0,
        createTime: db.serverDate()
      };
      const res = await db.collection('works').add({ data: work });
      work._id = res._id;
      return success(work);
    } catch (e) {
      return fail('创建作品失败: ' + e.message);
    }
  },

  async getList(openid, data) {
    try {
      const query = {};
      if (data.userId) query.userId = data.userId;
      if (data.status) query.status = data.status;
      if (data.category && data.category !== '全部') query.tags = data.category;
      const page = data.page || 1;
      const pageSize = data.pageSize || 20;
      const { total } = await db.collection('works').where(query).count();
      const { data: works } = await db.collection('works')
        .where(query)
        .orderBy('createTime', 'desc')
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .get();
      return success({ works, total, page, pageSize });
    } catch (e) {
      return fail('获取作品列表失败: ' + e.message);
    }
  },

  async getDetail(openid, data) {
    try {
      const { data: works } = await db.collection('works')
        .where({ _id: data.workId })
        .get();
      if (works.length === 0) return fail('作品不存在');
      return success(works[0]);
    } catch (e) {
      return fail('获取作品详情失败: ' + e.message);
    }
  },

  async update(openid, data) {
    try {
      const updateData = {};
      if (data.title !== undefined) updateData.title = data.title;
      if (data.desc !== undefined) updateData.desc = data.desc;
      if (data.tags !== undefined) updateData.tags = data.tags;
      await db.collection('works')
        .where({ _id: data.workId, userId: openid })
        .update({ data: updateData });
      return success({ updated: true });
    } catch (e) {
      return fail('更新作品失败: ' + e.message);
    }
  },

  async delete(openid, data) {
    try {
      await db.collection('works')
        .where({ _id: data.workId, userId: openid })
        .remove();
      return success({ deleted: true });
    } catch (e) {
      return fail('删除作品失败: ' + e.message);
    }
  },

  async publish(openid, data) {
    try {
      const updateData = { status: 'published' };
      if (data.title) updateData.title = data.title;
      if (data.desc) updateData.desc = data.desc;
      if (data.tags) updateData.tags = data.tags;
      await db.collection('works')
        .where({ _id: data.workId, userId: openid })
        .update({ data: updateData });
      return success({ published: true });
    } catch (e) {
      return fail('发布作品失败: ' + e.message);
    }
  },

  async toggleLike(openid, data) {
    try {
      const { data: works } = await db.collection('works')
        .where({ _id: data.workId })
        .get();
      if (works.length === 0) return fail('作品不存在');
      const work = works[0];
      const liked = work.likedBy && work.likedBy.includes(openid);
      if (liked) {
        await db.collection('works').where({ _id: data.workId }).update({
          data: {
            likes: _.inc(-1),
            likedBy: _.pull(openid)
          }
        });
      } else {
        await db.collection('works').where({ _id: data.workId }).update({
          data: {
            likes: _.inc(1),
            likedBy: _.push(openid)
          }
        });
      }
      return success({ liked: !liked });
    } catch (e) {
      return fail('点赞失败: ' + e.message);
    }
  },

  async toggleFavorite(openid, data) {
    try {
      const { data: works } = await db.collection('works')
        .where({ _id: data.workId })
        .get();
      if (works.length === 0) return fail('作品不存在');
      const work = works[0];
      const faved = work.favoritedBy && work.favoritedBy.includes(openid);
      if (faved) {
        await db.collection('works').where({ _id: data.workId }).update({
          data: {
            favorites: _.inc(-1),
            favoritedBy: _.pull(openid)
          }
        });
      } else {
        await db.collection('works').where({ _id: data.workId }).update({
          data: {
            favorites: _.inc(1),
            favoritedBy: _.push(openid)
          }
        });
      }
      return success({ favorited: !faved });
    } catch (e) {
      return fail('收藏失败: ' + e.message);
    }
  },

  async getFeed(openid, data) {
    try {
      const tab = data.tab || 'recommend';
      const page = data.page || 1;
      const pageSize = data.pageSize || 20;
      const query = { status: 'published' };
      let orderByField = 'createTime';
      let orderDirection = 'desc';
      if (tab === 'hot') {
        orderByField = 'likes';
      }
      const { total } = await db.collection('works').where(query).count();
      const { data: works } = await db.collection('works')
        .where(query)
        .orderBy(orderByField, orderDirection)
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .get();
      return success({ works, total, page, pageSize });
    } catch (e) {
      return fail('获取Feed失败: ' + e.message);
    }
  }
};

// ============ 积分模块 ============
const creditsModule = {
  async getBalance(openid) {
    try {
      const { data: users } = await db.collection('users').where({ openid }).get();
      if (users.length === 0) return fail('用户不存在');
      return success({ credits: users[0].credits });
    } catch (e) {
      return fail('获取余额失败: ' + e.message);
    }
  },

  async getRecords(openid, data) {
    try {
      const query = { userId: openid };
      if (data.type) query.type = data.type;
      const page = data.page || 1;
      const pageSize = data.pageSize || 20;
      const { data: records } = await db.collection('credits')
        .where(query)
        .orderBy('createTime', 'desc')
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .get();
      return success(records);
    } catch (e) {
      return fail('获取记录失败: ' + e.message);
    }
  },

  async checkin(openid) {
    try {
      const today = new Date();
      const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      // 检查今天是否已签到
      const { data: existing } = await db.collection('checkins')
        .where({ userId: openid, date: dateStr })
        .get();
      if (existing.length > 0) return fail('今日已签到');
      // 获取连续签到天数
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
      const { data: yesterdayCheckin } = await db.collection('checkins')
        .where({ userId: openid, date: yesterdayStr })
        .get();
      const streak = yesterdayCheckin.length > 0 ? yesterdayCheckin[0].streak + 1 : 1;
      const creditsEarned = 10;
      // 写入签到记录
      await db.collection('checkins').add({
        data: { userId: openid, date: dateStr, streak, creditsEarned, createTime: db.serverDate() }
      });
      // 更新用户积分
      await db.collection('users').where({ openid }).update({
        data: { credits: _.inc(creditsEarned) }
      });
      // 记录积分
      await db.collection('credits').add({
        data: {
          userId: openid,
          type: 'earn',
          amount: creditsEarned,
          source: '每日签到',
          description: `连续签到${streak}天`,
          createTime: db.serverDate()
        }
      });
      return success({ streak, creditsEarned });
    } catch (e) {
      return fail('签到失败: ' + e.message);
    }
  }
};

// ============ 消息模块 ============
const messageModule = {
  async getList(openid) {
    try {
      const types = ['like', 'favorite', 'remake', 'follow', 'system', 'service'];
      const result = {};
      for (const type of types) {
        const { total } = await db.collection('messages')
          .where({ userId: openid, type, isRead: false })
          .count();
        result[type] = { unread: total };
      }
      return success(result);
    } catch (e) {
      return fail('获取消息失败: ' + e.message);
    }
  },

  async getDetail(openid, data) {
    try {
      const page = data.page || 1;
      const pageSize = data.pageSize || 20;
      const query = { userId: openid, type: data.type };
      const { data: messages } = await db.collection('messages')
        .where(query)
        .orderBy('createTime', 'desc')
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .get();
      return success(messages);
    } catch (e) {
      return fail('获取消息详情失败: ' + e.message);
    }
  },

  async markRead(openid, data) {
    try {
      const query = { userId: openid, type: data.type };
      if (data.messageIds) {
        query._id = _.in(data.messageIds);
      }
      await db.collection('messages').where(query).update({
        data: { isRead: true }
      });
      return success({ marked: true });
    } catch (e) {
      return fail('标记已读失败: ' + e.message);
    }
  },

  async getUnreadCount(openid) {
    try {
      const { total } = await db.collection('messages')
        .where({ userId: openid, isRead: false })
        .count();
      return success({ count: total });
    } catch (e) {
      return fail('获取未读数失败: ' + e.message);
    }
  }
};

// ============ 反馈和举报 ============
const feedbackModule = {
  async submit(openid, data) {
    try {
      await db.collection('feedbacks').add({
        data: {
          userId: openid,
          type: data.type || 'bug',
          description: data.description || '',
          images: data.images || [],
          wechatId: data.wechatId || '',
          status: 'pending',
          createTime: db.serverDate()
        }
      });
      return success({ submitted: true });
    } catch (e) {
      return fail('提交反馈失败: ' + e.message);
    }
  }
};

const reportModule = {
  async submit(openid, data) {
    try {
      await db.collection('reports').add({
        data: {
          reporterId: openid,
          workId: data.workId || '',
          reason: data.reason || '',
          description: data.description || '',
          status: 'pending',
          createTime: db.serverDate()
        }
      });
      return success({ submitted: true });
    } catch (e) {
      return fail('提交举报失败: ' + e.message);
    }
  }
};

// ============ 社交模块 ============
const socialModule = {
  async toggleFollow(openid, data) {
    try {
      const { data: existing } = await db.collection('follows')
        .where({ followerId: openid, followingId: data.targetUserId })
        .get();
      if (existing.length > 0) {
        await db.collection('follows')
          .where({ _id: existing[0]._id })
          .remove();
        return success({ followed: false });
      } else {
        await db.collection('follows').add({
          data: {
            followerId: openid,
            followingId: data.targetUserId,
            createTime: db.serverDate()
          }
        });
        return success({ followed: true });
      }
    } catch (e) {
      return fail('关注操作失败: ' + e.message);
    }
  },

  async getFollowList(openid, data) {
    try {
      const query = {};
      if (data.type === 'following') {
        query.followerId = data.userId || openid;
      } else {
        query.followingId = data.userId || openid;
      }
      const { data: follows } = await db.collection('follows')
        .where(query)
        .orderBy('createTime', 'desc')
        .get();
      // 获取用户信息
      const userIds = follows.map(f => data.type === 'following' ? f.followingId : f.followerId);
      if (userIds.length > 0) {
        const { data: users } = await db.collection('users')
          .where({ openid: _.in(userIds) })
          .get();
        return success(users);
      }
      return success([]);
    } catch (e) {
      return fail('获取列表失败: ' + e.message);
    }
  }
};

// ============ 搜索模块 ============
const searchModule = {
  async works(openid, data) {
    try {
      const keyword = data.keyword || '';
      const page = data.page || 1;
      const pageSize = data.pageSize || 20;
      const query = {
        status: 'published',
        _: _.or([
          { title: db.RegExp({ regexp: keyword, options: 'i' }) },
          { prompt: db.RegExp({ regexp: keyword, options: 'i' }) },
          { tags: keyword }
        ])
      };
      const { data: works } = await db.collection('works')
        .where(query)
        .orderBy('createTime', 'desc')
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .get();
      return success(works);
    } catch (e) {
      return fail('搜索失败: ' + e.message);
    }
  }
};

// ============ AI 模块 ============
const axios = require('axios');
const KIE_API_KEY = process.env.KIE_API_KEY || '009ee8a806d45dbda1a2bc37ef3a2165';
const KIE_API_BASE = 'https://api.kie.ai/api/v1';

// 模型 ID 映射
const MODEL_MAP = {
  'nano-banana-2': 'nano-banana-2',
  'gpt-image-2': 'gpt-image-2',
  'nano-banana-pro': 'nano-banana-pro',
  'seedream-4.5': 'seedream-4.5'
};

const aiModule = {
  async generateImage(openid, data) {
    try {
      const { prompt, model, ratio, quality, count, style } = data;
      if (!prompt) return fail('请输入提示词');

      // 检查积分
      const { data: users } = await db.collection('users').where({ openid }).get();
      if (users.length === 0) return fail('用户不存在');
      const user = users[0];

      const modelId = MODEL_MAP[model] || model;
      const costPerImage = ({ 'nano-banana-2': 8, 'gpt-image-2': 15, 'nano-banana-pro': 12, 'seedream-4.5': 10 })[modelId] || 10;
      const totalCost = costPerImage * (count || 1);

      if (user.credits < totalCost) return fail('积分不足，需要 ' + totalCost + ' 积分');

      // 调用 kie.ai API 提交任务
      const response = await axios.post(KIE_API_BASE + '/generate', {
        model: modelId,
        prompt: style ? prompt + ', ' + style + ' style' : prompt,
        aspectRatio: ratio || '1:1',
        n: count || 1
      }, {
        headers: { 'Authorization': 'Bearer ' + KIE_API_KEY },
        timeout: 30000
      });

      const taskId = response.data.taskId || response.data.id;
      if (!taskId) return fail('任务提交失败');

      // 预扣积分
      await db.collection('users').where({ openid }).update({
        data: { credits: _.inc(-totalCost) }
      });
      await db.collection('credits').add({
        data: { userId: openid, type: 'spend', amount: totalCost, source: 'AI生图', description: model + ' x' + (count || 1), createTime: db.serverDate() }
      });

      return success({ taskId, cost: totalCost });
    } catch (e) {
      console.error('AI生图失败', e.message);
      return fail('AI生图失败: ' + (e.message || '未知错误'));
    }
  },

  async getTaskStatus(openid, data) {
    try {
      const { taskId } = data;
      if (!taskId) return fail('缺少任务ID');

      const response = await axios.get(KIE_API_BASE + '/task/' + taskId, {
        headers: { 'Authorization': 'Bearer ' + KIE_API_KEY },
        timeout: 15000
      });

      const task = response.data;
      if (task.status === 'completed' && task.images) {
        // 下载图片并上传到云存储
        const imageUrls = [];
        for (const imgUrl of task.images) {
          try {
            const imgResp = await axios.get(imgUrl, { responseType: 'arraybuffer', timeout: 30000 });
            const buffer = Buffer.from(imgResp.data);
            const cloudPath = 'works/' + openid + '/' + Date.now() + '_' + Math.random().toString(36).substr(2, 8) + '.png';
            const uploadResult = await cloud.uploadFile({ cloudPath, fileContent: buffer });
            imageUrls.push(uploadResult.fileID);
          } catch (uploadErr) {
            console.error('图片上传失败', uploadErr.message);
          }
        }

        // 创建作品记录
        const workResult = await db.collection('works').add({
          data: {
            userId: openid,
            imageUrls: imageUrls,
            prompt: data.prompt || '',
            model: data.model || '',
            ratio: data.ratio || '1:1',
            status: 'draft',
            likes: 0,
            favorites: 0,
            remakes: 0,
            createTime: db.serverDate()
          }
        });

        return success({ status: 'completed', imageUrls, workId: workResult._id });
      }

      return success({ status: task.status || 'processing', progress: task.progress || 0 });
    } catch (e) {
      console.error('查询任务状态失败', e.message);
      return fail('查询失败: ' + (e.message || '未知错误'));
    }
  },

  async reversePrompt(openid, data) {
    try {
      const { imageFileId } = data;
      if (!imageFileId) return fail('请上传图片');

      // 检查积分
      const { data: users } = await db.collection('users').where({ openid }).get();
      if (users.length === 0) return fail('用户不存在');
      if (users[0].credits < 5) return fail('积分不足，需要5积分');

      // 下载图片
      const downloadResult = await cloud.downloadFile({ fileID: imageFileId });
      const base64Image = downloadResult.fileContent.toString('base64');

      // 调用 kie.ai 图片分析接口
      const response = await axios.post(KIE_API_BASE + '/analyze', {
        image: base64Image,
        task: 'describe'
      }, {
        headers: { 'Authorization': 'Bearer ' + KIE_API_KEY },
        timeout: 30000
      });

      // 扣除积分
      await db.collection('users').where({ openid }).update({
        data: { credits: _.inc(-5) }
      });
      await db.collection('credits').add({
        data: { userId: openid, type: 'spend', amount: 5, source: '反推提示词', description: '图片分析', createTime: db.serverDate() }
      });

      return success({ prompt: response.data.description || response.data.prompt || '' });
    } catch (e) {
      console.error('反推提示词失败', e.message);
      return fail('分析失败: ' + (e.message || '未知错误'));
    }
  }
};

// ============ 主入口 ============
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  const { action, data = {} } = event;

  if (!action) return fail('缺少action参数');

  const [module, method] = action.split('.');

  switch (module) {
    case 'user':
      if (method === 'login') return userModule.login(openid);
      if (method === 'getProfile') return userModule.getProfile(openid, data);
      if (method === 'updateProfile') return userModule.updateProfile(openid, data);
      return fail('未知用户操作');

    case 'content':
      if (method === 'getBanners') return contentModule.getBanners();
      if (method === 'getModels') return contentModule.getModels();
      if (method === 'getStyles') return contentModule.getStyles();
      if (method === 'getGameplays') return contentModule.getGameplays();
      if (method === 'getCategories') return contentModule.getCategories();
      return fail('未知内容操作');

    case 'work':
      if (method === 'create') return workModule.create(openid, data);
      if (method === 'getList') return workModule.getList(openid, data);
      if (method === 'getDetail') return workModule.getDetail(openid, data);
      if (method === 'update') return workModule.update(openid, data);
      if (method === 'delete') return workModule.delete(openid, data);
      if (method === 'publish') return workModule.publish(openid, data);
      if (method === 'toggleLike') return workModule.toggleLike(openid, data);
      if (method === 'toggleFavorite') return workModule.toggleFavorite(openid, data);
      if (method === 'getFeed') return workModule.getFeed(openid, data);
      return fail('未知作品操作');

    case 'credits':
      if (method === 'getBalance') return creditsModule.getBalance(openid);
      if (method === 'getRecords') return creditsModule.getRecords(openid, data);
      if (method === 'checkin') return creditsModule.checkin(openid);
      return fail('未知积分操作');

    case 'message':
      if (method === 'getList') return messageModule.getList(openid);
      if (method === 'getDetail') return messageModule.getDetail(openid, data);
      if (method === 'markRead') return messageModule.markRead(openid, data);
      if (method === 'getUnreadCount') return messageModule.getUnreadCount(openid);
      return fail('未知消息操作');

    case 'feedback':
      if (method === 'submit') return feedbackModule.submit(openid, data);
      return fail('未知反馈操作');

    case 'report':
      if (method === 'submit') return reportModule.submit(openid, data);
      return fail('未知举报操作');

    case 'social':
      if (method === 'toggleFollow') return socialModule.toggleFollow(openid, data);
      if (method === 'getFollowList') return socialModule.getFollowList(openid, data);
      return fail('未知社交操作');

    case 'search':
      if (method === 'works') return searchModule.works(openid, data);
      return fail('未知搜索操作');

    case 'ai':
      if (method === 'generateImage') return aiModule.generateImage(openid, data);
      if (method === 'getTaskStatus') return aiModule.getTaskStatus(openid, data);
      if (method === 'reversePrompt') return aiModule.reversePrompt(openid, data);
      return fail('未知AI操作');

    case 'admin':
      // 管理员权限校验
      const { data: admins } = await db.collection('users')
        .where({ openid, isAdmin: true })
        .get();
      if (admins.length === 0) return fail('无管理员权限');
      // TODO: 管理后台操作（后续实现）
      return fail('管理后台功能开发中');

    default:
      return fail('未知模块: ' + module);
  }
};
