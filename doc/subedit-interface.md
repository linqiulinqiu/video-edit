# SubEdit 前后端接口
## 运行环境

Vue 应用运行在 Web Server /subedit/dist 目录下，后端接口URL位于 Web Server /subedit 目录下

信息获取均采用GET，信息保存均采用POST，暂不使用CSRF Token

## 页面启动

页面启动URL: HOST/subedit/dist/index.html?sid=SUBTITLE_ID
仅有一个参数： SUBTITLE_ID

## 信息获取

### Subtitle Info

* 返回指定字幕详细信息
* URL: subtitle-info/SUBTITLE_ID
* 参数:
    - rev: 字幕编辑版本(subsnap版本)，可选，不应大于最新版本号
* 返回格式：JSON Object
* 主要 Keys:
    - id: SUBTITLE_ID
    - video_id: 对应的视频ID
    - lang.name: 对应的语言名称
    - revision: 最新版本
    - subsnap.spks: 最新版本的说话人对应表
    - subsnap.chunks: 最新版本的句子/段落列表



### All Speakers

* 返回全部系统语音信息（说话人列表）
* URL: all-speakers
* 返回格式： JSON Array
* 主要Item Key:
    - id: 系统说话人ID
    - name: 系统说话人名称
    - gender: 系统说话人性别 'm'-男，'f'-女

### Video

### Sample Voice

* 系统说话人的示例音频
* URL: /storage/samples/ID-LANG.mp3
    - ID: 系统说话人ID
    - LANG: 语言名
    例子：/storage/samples/8-zh-CN.mp3
