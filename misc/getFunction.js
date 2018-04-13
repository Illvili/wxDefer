var nonThenableFunctionList = [
    'wx.stopRecord',
    'wx.pauseVoice',
    'wx.stopVoice',
    'wx.pauseBackgroundAudio',
    'wx.stopBackgroundAudio',
    'wx.stopPullDownRefresh',
    'wx.createSelectorQuery',
    'wx.createIntersectionObserver',
    'wx.createWorker',
]

function getSummaryTree($root) {
    return Array.prototype.map.call($root.children('.chapter'), (chapter => {
        var $chapter = $(chapter),
            item = {
                name: $chapter.data('name'),
                // path: $chapter.data('path')
            },
            $sublist = $chapter.children('.articles')

        if ($sublist.length) {
            item.list = getSummaryTree($sublist)

            if (item.list.every(_ => !_)) {
                return false
            } else {
                return '// ' + item.name + '\n' + item.list.filter(_ => !!_).join('\n')
            }
        }

        if (
            item.name.startsWith('wx.') &&
            // onXXX(callback)
            !item.name.startsWith('wx.on') &&
            // sync function
            !item.name.endsWith('Sync') &&
            // getManager
            !item.name.endsWith('Manager') &&
            // no in black list
            -1 == nonThenableFunctionList.indexOf(item.name)
        ) {
            return item.name + ','
        } else if (/[^a-z\.]/i.test(item.name)) {
            return false
        } else {
            return `// ${item.name}`
        }
    }))
}

getSummaryTree($('.summary')).filter(_ => !!_).join('\n\n')
