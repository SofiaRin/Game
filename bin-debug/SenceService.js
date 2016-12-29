var SenceService = (function () {
    function SenceService() {
        this.observerList = [];
        SenceService.count++;
        if (SenceService.count > 1) {
            throw 'singleton!!';
        }
    }
    var d = __define,c=SenceService,p=c.prototype;
    SenceService.getInstance = function () {
        if (SenceService.instance == null) {
            SenceService.instance = new SenceService();
        }
        return SenceService.instance;
    };
    p.addObserver = function (_observer) {
        this.observerList.push(_observer);
    };
    p.notify = function (_monsterId) {
        for (var i = 0; i < this.observerList.length; i++) {
            this.observerList[i].onChange(_monsterId);
        }
    };
    SenceService.count = 0;
    return SenceService;
}());
egret.registerClass(SenceService,'SenceService');
var KillMonsterButton = (function (_super) {
    __extends(KillMonsterButton, _super);
    function KillMonsterButton(_monsterId) {
        _super.call(this);
        this.monsterId = _monsterId;
        this.button = this.createBitmapByName("Kill_png");
        this.addChild(this.button);
        this.onButtonClick(_monsterId);
    }
    var d = __define,c=KillMonsterButton,p=c.prototype;
    p.onChange = function () {
    };
    p.onButtonClick = function (_monsterId) {
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            var menu = TaskService.getInstance();
            menu.getTaskByCustomRule(function sortForMonster(taskInfo) {
                for (var t in taskInfo) {
                    if (taskInfo[t].condition.tragetMonsterId == _monsterId && taskInfo[t].status == TaskStatus.DURING) {
                        SenceService.getInstance().notify(_monsterId);
                        taskInfo[t].condition.updateProgress(taskInfo[t]);
                    }
                }
                console.log("Monster Kill Tap");
            });
        }, this);
    };
    p.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    return KillMonsterButton;
}(egret.DisplayObjectContainer));
egret.registerClass(KillMonsterButton,'KillMonsterButton',["Observer"]);
//# sourceMappingURL=SenceService.js.map