app.controller('tagsCtr', ['$scope', '$filter', '$window', 'bookmarkService', 'pubSubService', function($scope, $filter, $window, bookmarkService, pubSubService) {
    console.log("Hello tagsCtr...");
    getTags({});

    const perPageItems = 20;
    $scope.tags = []; // 书签数据
    $scope.bookmarkClicked = false;
    $scope.bookmarks = [];
    $scope.bookmarkCount = 0;
    $scope.totalPages = 0;
    $scope.currentPage = 1;
    $scope.inputPage = '';
    $scope.currentTagId = "";

    pubSubService.subscribe('MenuCtr.tags', $scope, function(event, data) {
        console.log('subscribe MenuCtr.tags', data);
        getTags({});
    });

    $scope.getBookmarks = function(tagId, currentPage) {
        $scope.bookmarkClicked = true;
        $scope.currentTagId = tagId;

        $scope.tags.forEach(function(tag) {
            tag.bookmarkClicked = false;
            if (tag.id == tagId) {
                tag.bookmarkClicked = true;
            }
        });

        var params = {
            tagId: tagId,
            currentPage: currentPage,
            perPageItems: perPageItems,
        };
        bookmarkService.getBookmarksByTag(params)
            .then((data) => {
                $scope.bookmarks = data.bookmarks;
                $scope.bookmarkCount = data.totalItems;
                $scope.totalPages = Math.ceil($scope.bookmarkCount / perPageItems);

                $scope.inputPage = ''
            })
            .catch((err) => console.log('getTags err', err));
    };

    $scope.changeCurrentPage = function(currentPage) {
        currentPage = parseInt(currentPage) || 0;
        console.log(currentPage);
        if (currentPage <= $scope.totalPages && currentPage >= 1) {
            $scope.getBookmarks($scope.currentTagId, currentPage);
            $scope.currentPage = currentPage;
        }
    }

    $scope.jumpToUrl = function(url, id) {
        if (!$scope.edit) {
            $window.open(url, '_blank');
            bookmarkService.clickBookmark({
                id: id
            });
        }
    }

    $scope.delBookmark = function(bookmarkId) {
        toastr.warning('功能暂未实现。。。', "警告");
        return;
        var params = {
            id: bookmarkId
        }
        bookmarkService.delBookmark(params)
            .then((data) => $("#" + bookmarkId).remove())
            .catch((err) => {
                console.log('delBookmark err ', err)
            });
    }
    $scope.editBookmark = function(bookmarkId) {
        toastr.warning('功能暂未实现。。。', "警告");
        return;
        pubSubService.publish('bookmarksCtr.editBookmark', {
            'bookmarkId': bookmarkId
        });
    }

    $scope.detailBookmark = function(bookmarkId) {
        toastr.warning('功能暂未实现。。。', "警告");
    }

    function getTags(params) {
        bookmarkService.getTags(params)
            .then((data) => {
                $scope.tags = data
                if (!$scope.currentTagId && $scope.tags.length > 0) {
                    $scope.currentTagId = $scope.tags[0].id;
                    $scope.tags[0].bookmarkClicked = true;
                }

                if ($scope.currentTagId) {
                    $scope.getBookmarks($scope.currentTagId, 1);
                }
            })
            .catch((err) => console.log('getTags err', err));

        pubSubService.publish('Common.menuActive', {
            login: true,
            index: 1
        });
    }
}]);
