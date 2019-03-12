'use strict';

function wxPromisify(fn) {
    return function () {
        var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        return new Promise(function (resolve, reject) {
            obj.success = function (res) {
                //成功
                wx.hideToast();
                console.log('→返回数据：' + JSON.stringify(res.data));
                console.log('→end');
                resolve(res);
            };
            obj.fail = function (res) {
                //失败
                console.log('→请求失败：' + JSON.stringify(res));
                console.log('→end');
                wx.hideToast();
                reject(res);
            };
            fn(obj);
        });
    };
}
//无论promise对象最后状态如何都会执行
Promise.prototype.finally = function (callback) {
    var P = this.constructor;
    return this.then(function (value) {
        return P.resolve(callback()).then(function () {
            return value;
        });
    }, function (reason) {
        return P.resolve(callback()).then(function () {
            throw reason;
        });
    });
};

function wxUpLoadFile(url, formData, token) {
    console.log(url);
    console.log(formData);
    wx.showToast({
        title: '加载中',
        icon: 'loading',
        duration: 10000
    });
    var wxtUpLoadFile = wxPromisify(wx.uploadFile);
    return wxtUpLoadFile({
        url: url,
        name: 'file',
        filePath: formData,
        header: {
            "Authorization": 'Bearer ' + token
        }
    });
}

module.exports = {
    uploadFile: wxUpLoadFile
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInVwbG9hZEZpbGUuanMiXSwibmFtZXMiOlsid3hQcm9taXNpZnkiLCJmbiIsIm9iaiIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwic3VjY2VzcyIsInJlcyIsInd4IiwiaGlkZVRvYXN0IiwiY29uc29sZSIsImxvZyIsIkpTT04iLCJzdHJpbmdpZnkiLCJkYXRhIiwiZmFpbCIsInByb3RvdHlwZSIsImZpbmFsbHkiLCJjYWxsYmFjayIsIlAiLCJjb25zdHJ1Y3RvciIsInRoZW4iLCJ2YWx1ZSIsInJlYXNvbiIsInd4VXBMb2FkRmlsZSIsInVybCIsImZvcm1EYXRhIiwidG9rZW4iLCJzaG93VG9hc3QiLCJ0aXRsZSIsImljb24iLCJkdXJhdGlvbiIsInd4dFVwTG9hZEZpbGUiLCJ1cGxvYWRGaWxlIiwibmFtZSIsImZpbGVQYXRoIiwiaGVhZGVyIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7QUFDQSxTQUFTQSxXQUFULENBQXFCQyxFQUFyQixFQUF5QjtBQUNyQixXQUFPLFlBQW9CO0FBQUEsWUFBVkMsR0FBVSx1RUFBSixFQUFJOztBQUN2QixlQUFPLElBQUlDLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDcENILGdCQUFJSSxPQUFKLEdBQWMsVUFBVUMsR0FBVixFQUFlO0FBQ3pCO0FBQ0FDLG1CQUFHQyxTQUFIO0FBQ0FDLHdCQUFRQyxHQUFSLENBQVksV0FBV0MsS0FBS0MsU0FBTCxDQUFlTixJQUFJTyxJQUFuQixDQUF2QjtBQUNBSix3QkFBUUMsR0FBUixDQUFZLE1BQVo7QUFDQVAsd0JBQVFHLEdBQVI7QUFDSCxhQU5EO0FBT0FMLGdCQUFJYSxJQUFKLEdBQVcsVUFBVVIsR0FBVixFQUFlO0FBQ3RCO0FBQ0FHLHdCQUFRQyxHQUFSLENBQVksV0FBV0MsS0FBS0MsU0FBTCxDQUFlTixHQUFmLENBQXZCO0FBQ0FHLHdCQUFRQyxHQUFSLENBQVksTUFBWjtBQUNBSCxtQkFBR0MsU0FBSDtBQUNBSix1QkFBT0UsR0FBUDtBQUNILGFBTkQ7QUFPQU4sZUFBR0MsR0FBSDtBQUNILFNBaEJNLENBQVA7QUFpQkgsS0FsQkQ7QUFtQkg7QUFDRDtBQUNBQyxRQUFRYSxTQUFSLENBQWtCQyxPQUFsQixHQUE0QixVQUFVQyxRQUFWLEVBQW9CO0FBQzVDLFFBQUlDLElBQUksS0FBS0MsV0FBYjtBQUNBLFdBQU8sS0FBS0MsSUFBTCxDQUNIO0FBQUEsZUFBU0YsRUFBRWYsT0FBRixDQUFVYyxVQUFWLEVBQXNCRyxJQUF0QixDQUEyQjtBQUFBLG1CQUFNQyxLQUFOO0FBQUEsU0FBM0IsQ0FBVDtBQUFBLEtBREcsRUFFSDtBQUFBLGVBQVVILEVBQUVmLE9BQUYsQ0FBVWMsVUFBVixFQUFzQkcsSUFBdEIsQ0FBMkIsWUFBTTtBQUFFLGtCQUFNRSxNQUFOO0FBQWMsU0FBakQsQ0FBVjtBQUFBLEtBRkcsQ0FBUDtBQUlILENBTkQ7O0FBU0EsU0FBU0MsWUFBVCxDQUFzQkMsR0FBdEIsRUFBMkJDLFFBQTNCLEVBQXFDQyxLQUFyQyxFQUE0QztBQUN4Q2pCLFlBQVFDLEdBQVIsQ0FBWWMsR0FBWjtBQUNBZixZQUFRQyxHQUFSLENBQVllLFFBQVo7QUFDQWxCLE9BQUdvQixTQUFILENBQWE7QUFDVEMsZUFBTyxLQURFO0FBRVRDLGNBQU0sU0FGRztBQUdUQyxrQkFBVTtBQUhELEtBQWI7QUFLQSxRQUFJQyxnQkFBZ0JoQyxZQUFZUSxHQUFHeUIsVUFBZixDQUFwQjtBQUNBLFdBQU9ELGNBQWM7QUFDakJQLGFBQUtBLEdBRFk7QUFFakJTLGNBQU0sTUFGVztBQUdqQkMsa0JBQVVULFFBSE87QUFJakJVLGdCQUFRO0FBQ0osNkJBQWlCLFlBQVlUO0FBRHpCO0FBSlMsS0FBZCxDQUFQO0FBUUg7O0FBRURVLE9BQU9DLE9BQVAsR0FBaUI7QUFDYkwsZ0JBQVlUO0FBREMsQ0FBakIiLCJmaWxlIjoidXBsb2FkRmlsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuZnVuY3Rpb24gd3hQcm9taXNpZnkoZm4pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKG9iaiA9IHt9KSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBvYmouc3VjY2VzcyA9IGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgICAgICAvL+aIkOWKn1xuICAgICAgICAgICAgICAgIHd4LmhpZGVUb2FzdCgpXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+KGkui/lOWbnuaVsOaNru+8micgKyBKU09OLnN0cmluZ2lmeShyZXMuZGF0YSkpXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+KGkmVuZCcpXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShyZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb2JqLmZhaWwgPSBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICAgICAgLy/lpLHotKVcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn4oaS6K+35rGC5aSx6LSl77yaJyArIEpTT04uc3RyaW5naWZ5KHJlcykpXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+KGkmVuZCcpXG4gICAgICAgICAgICAgICAgd3guaGlkZVRvYXN0KClcbiAgICAgICAgICAgICAgICByZWplY3QocmVzKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm4ob2JqKVxuICAgICAgICB9KVxuICAgIH1cbn1cbi8v5peg6K66cHJvbWlzZeWvueixoeacgOWQjueKtuaAgeWmguS9lemDveS8muaJp+ihjFxuUHJvbWlzZS5wcm90b3R5cGUuZmluYWxseSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgIGxldCBQID0gdGhpcy5jb25zdHJ1Y3RvcjtcbiAgICByZXR1cm4gdGhpcy50aGVuKFxuICAgICAgICB2YWx1ZSA9PiBQLnJlc29sdmUoY2FsbGJhY2soKSkudGhlbigoKSA9PiB2YWx1ZSksXG4gICAgICAgIHJlYXNvbiA9PiBQLnJlc29sdmUoY2FsbGJhY2soKSkudGhlbigoKSA9PiB7IHRocm93IHJlYXNvbiB9KVxuICAgICk7XG59O1xuXG5cbmZ1bmN0aW9uIHd4VXBMb2FkRmlsZSh1cmwsIGZvcm1EYXRhLCB0b2tlbikge1xuICAgIGNvbnNvbGUubG9nKHVybClcbiAgICBjb25zb2xlLmxvZyhmb3JtRGF0YSlcbiAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICB0aXRsZTogJ+WKoOi9veS4rScsXG4gICAgICAgIGljb246ICdsb2FkaW5nJyxcbiAgICAgICAgZHVyYXRpb246IDEwMDAwXG4gICAgfSlcbiAgICB2YXIgd3h0VXBMb2FkRmlsZSA9IHd4UHJvbWlzaWZ5KHd4LnVwbG9hZEZpbGUpO1xuICAgIHJldHVybiB3eHRVcExvYWRGaWxlKHtcbiAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgIG5hbWU6ICdmaWxlJyxcbiAgICAgICAgZmlsZVBhdGg6IGZvcm1EYXRhLFxuICAgICAgICBoZWFkZXI6IHtcbiAgICAgICAgICAgIFwiQXV0aG9yaXphdGlvblwiOiAnQmVhcmVyICcgKyB0b2tlblxuICAgICAgICB9XG4gICAgfSlcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgdXBsb2FkRmlsZTogd3hVcExvYWRGaWxlXG59XG4iXX0=