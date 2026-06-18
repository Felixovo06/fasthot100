window.HOT100 = window.HOT100 || [];
window.HOT100.push(
{
  lc: 160,
  title: "相交链表",
  cat: "链表",
  diff: "简单",
  tier: "B",
  budget: 60,
  pattern: "双指针换头",
  desc: "找出两个单链表相交的起始节点，无交点返回 null。",
  idea: "两指针同时走，走到尽头就换到对方头部继续：a+c+b = b+c+a，第二轮必在交点相遇；无交点则同时到 null。",
  traps: ["换头时是 headB 而不是自己的头", "无交点时循环也会因同时为 null 而退出，无需特判"],
  comp: "时间 O(m+n)，空间 O(1)",
  code: `public class Solution {
    public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
        ListNode a = headA, b = headB;
        while (a != b) {
            a = a == null ? headB : a.next; // 走完换对方的头
            b = b == null ? headA : b.next;
        }
        return a;
    }
}`
},
{
  lc: 206,
  title: "反转链表",
  cat: "链表",
  diff: "简单",
  tier: "S",
  budget: 240,
  pattern: "迭代三指针",
  desc: "反转单链表并返回新的头节点。",
  idea: "prev/cur 迭代：暂存 next，把 cur.next 指回 prev，三者整体右移；cur 走到 null 时 prev 即新头。",
  traps: ["返回 prev 而不是 cur", "追问递归版：newHead = reverse(head.next)，然后 head.next.next = head; head.next = null"],
  comp: "时间 O(n)，空间 O(1)",
  code: `class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null, cur = head;
        while (cur != null) {
            ListNode next = cur.next; // 暂存后继
            cur.next = prev;
            prev = cur;
            cur = next;
        }
        return prev;
    }
}`
},
{
  lc: 234,
  title: "回文链表",
  cat: "链表",
  diff: "简单",
  tier: "A",
  budget: 150,
  pattern: "中点+反转后半",
  desc: "判断单链表是否为回文链表，要求 O(n) 时间 O(1) 空间。",
  idea: "快慢指针找中点 → 反转后半段 → 从两头同步比对。",
  traps: ["奇数长度时慢指针停在正中，后半从 slow.next 开始反转即可", "比对循环以后半指针非空为条件"],
  comp: "时间 O(n)，空间 O(1)",
  code: `class Solution {
    public boolean isPalindrome(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast.next != null && fast.next.next != null) { // 找中点
            slow = slow.next;
            fast = fast.next.next;
        }
        ListNode second = reverse(slow.next); // 反转后半
        ListNode p = head, q = second;
        boolean ok = true;
        while (q != null) {
            if (p.val != q.val) { ok = false; break; }
            p = p.next; q = q.next;
        }
        return ok;
    }

    private ListNode reverse(ListNode head) {
        ListNode prev = null;
        while (head != null) {
            ListNode next = head.next;
            head.next = prev;
            prev = head;
            head = next;
        }
        return prev;
    }
}`
},
{
  lc: 141,
  title: "环形链表",
  cat: "链表",
  diff: "简单",
  tier: "B",
  budget: 60,
  pattern: "快慢指针",
  desc: "判断链表中是否存在环。",
  idea: "快指针一次两步、慢指针一次一步，有环必相遇，无环快指针先到 null。",
  traps: ["循环条件检查 fast 和 fast.next 都非空"],
  comp: "时间 O(n)，空间 O(1)",
  code: `public class Solution {
    public boolean hasCycle(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) return true;
        }
        return false;
    }
}`
},
{
  lc: 142,
  title: "环形链表 II",
  cat: "链表",
  diff: "中等",
  tier: "A",
  budget: 150,
  pattern: "Floyd 判圈",
  desc: "返回链表入环的第一个节点，无环返回 null。",
  idea: "快慢指针相遇后，把一个指针放回头部，两指针同速前进，再次相遇处即入环口（头到入口距离 = 相遇点沿环到入口距离，a = c + (k-1)·环长 可推出）。",
  traps: ["能口述推导：相遇时 fast 走的是 slow 的两倍 → a + b = b + c 的环长倍数关系"],
  comp: "时间 O(n)，空间 O(1)",
  code: `public class Solution {
    public ListNode detectCycle(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) {           // 相遇后一人回起点
                ListNode p = head;
                while (p != slow) { p = p.next; slow = slow.next; }
                return p;                 // 同速再相遇即入环口
            }
        }
        return null;
    }
}`
},
{
  lc: 21,
  title: "合并两个有序链表",
  cat: "链表",
  diff: "简单",
  tier: "B",
  budget: 60,
  pattern: "哨兵节点",
  desc: "将两个升序链表合并为一个升序链表。",
  idea: "哨兵节点起头，每次把两链表头中较小者接到尾部，最后把剩余一条整体接上。",
  traps: ["循环后别忘接上未走完的那条"],
  comp: "时间 O(m+n)，空间 O(1)",
  code: `class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        ListNode dummy = new ListNode(0), tail = dummy;
        while (list1 != null && list2 != null) {
            if (list1.val <= list2.val) { tail.next = list1; list1 = list1.next; }
            else { tail.next = list2; list2 = list2.next; }
            tail = tail.next;
        }
        tail.next = list1 != null ? list1 : list2; // 接上剩余
        return dummy.next;
    }
}`
},
{
  lc: 2,
  title: "两数相加",
  cat: "链表",
  diff: "中等",
  tier: "A",
  budget: 150,
  pattern: "模拟竖式加法",
  desc: "两个逆序存储数字的链表相加，返回同样逆序的结果链表。",
  idea: "同步遍历两链表逐位相加并维护进位 carry，节点值为 sum % 10；循环条件包含 carry != 0，自动处理最高位进位。",
  traps: ["循环条件 l1、l2、carry 三者任一存在就继续，最后不会漏进位"],
  comp: "时间 O(max(m,n))，空间 O(1)（不计输出）",
  code: `class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0), tail = dummy;
        int carry = 0;
        while (l1 != null || l2 != null || carry != 0) {
            int sum = carry;
            if (l1 != null) { sum += l1.val; l1 = l1.next; }
            if (l2 != null) { sum += l2.val; l2 = l2.next; }
            carry = sum / 10;
            tail.next = new ListNode(sum % 10);
            tail = tail.next;
        }
        return dummy.next;
    }
}`
},
{
  lc: 19,
  title: "删除链表的倒数第 N 个结点",
  cat: "链表",
  diff: "中等",
  tier: "A",
  budget: 150,
  pattern: "哨兵+快慢间隔",
  desc: "一趟扫描删除链表的倒数第 n 个节点。",
  idea: "快指针先走 n+1 步（从哨兵算起），然后快慢同步走；快到 null 时慢指针恰好停在待删节点的前驱。",
  traps: ["哨兵节点处理删头节点的情况", "快指针先走的步数要让 slow 停在前驱而非待删节点本身"],
  comp: "时间 O(n)，空间 O(1)",
  code: `class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy = new ListNode(0, head);
        ListNode fast = dummy, slow = dummy;
        for (int i = 0; i <= n; i++) fast = fast.next; // 先走 n+1 步
        while (fast != null) {
            fast = fast.next;
            slow = slow.next;
        }
        slow.next = slow.next.next; // slow 是前驱
        return dummy.next;
    }
}`
},
{
  lc: 24,
  title: "两两交换链表中的节点",
  cat: "链表",
  diff: "中等",
  tier: "A",
  budget: 150,
  pattern: "哨兵+迭代交换",
  desc: "两两交换链表中相邻的节点并返回新头（不能只改值）。",
  idea: "哨兵 + prev 指针迭代：每轮取出 a、b 两个节点，按 prev→b→a→后续 重新接线，prev 移到 a。",
  traps: ["接线顺序：先 prev.next = b，再 a.next = b.next 之前要暂存", "循环条件 prev.next 和 prev.next.next 都非空"],
  comp: "时间 O(n)，空间 O(1)",
  code: `class Solution {
    public ListNode swapPairs(ListNode head) {
        ListNode dummy = new ListNode(0, head), prev = dummy;
        while (prev.next != null && prev.next.next != null) {
            ListNode a = prev.next, b = a.next;
            a.next = b.next;  // a 接到 b 的后面
            b.next = a;
            prev.next = b;
            prev = a;         // 下一轮的前驱
        }
        return dummy.next;
    }
}`
},
{
  lc: 25,
  title: "K 个一组翻转链表",
  cat: "链表",
  diff: "困难",
  tier: "S",
  budget: 240,
  pattern: "哨兵+分组反转",
  desc: "每 k 个节点一组翻转链表，不足 k 个的尾部保持原序。",
  idea: "哨兵 + groupPrev 逐组处理：先探测本组第 k 个节点（不够就结束）；记下组头和下一组起点，反转本组后把 groupPrev 接到新组头、旧组头接到下一组起点，旧组头成为新的 groupPrev。",
  traps: ["探测不足 k 个时直接 return，保持原序", "反转后旧组头变组尾，groupPrev 要移到它", "边界全靠哨兵，别用裸 head"],
  comp: "时间 O(n)，空间 O(1)",
  code: `class Solution {
    public ListNode reverseKGroup(ListNode head, int k) {
        ListNode dummy = new ListNode(0, head);
        ListNode groupPrev = dummy;
        while (true) {
            ListNode kth = groupPrev;            // 探测第 k 个
            for (int i = 0; i < k && kth != null; i++) kth = kth.next;
            if (kth == null) break;              // 不足 k 个，保持原序
            ListNode groupNext = kth.next;
            ListNode prev = groupNext, cur = groupPrev.next; // 反转本组
            while (cur != groupNext) {
                ListNode next = cur.next;
                cur.next = prev;
                prev = cur;
                cur = next;
            }
            ListNode oldHead = groupPrev.next;   // 旧组头已变组尾
            groupPrev.next = kth;                // 接新组头
            groupPrev = oldHead;
        }
        return dummy.next;
    }
}`
},
{
  lc: 138,
  title: "随机链表的复制",
  cat: "链表",
  diff: "中等",
  tier: "A",
  budget: 150,
  pattern: "哈希映射旧→新",
  desc: "深拷贝一个每个节点带 random 随机指针的链表。",
  idea: "两遍扫描：第一遍为每个节点建新节点并存入 哈希表(旧→新)；第二遍用映射接好 next 和 random。",
  traps: ["random 可能为 null，map.get(null) 返回 null 恰好正确", "追问 O(1) 空间：新节点交织插在旧节点后，再拆分"],
  comp: "时间 O(n)，空间 O(n)",
  code: `class Solution {
    public Node copyRandomList(Node head) {
        Map<Node, Node> map = new HashMap<>();
        for (Node p = head; p != null; p = p.next)
            map.put(p, new Node(p.val));      // 旧 → 新
        for (Node p = head; p != null; p = p.next) {
            map.get(p).next = map.get(p.next);
            map.get(p).random = map.get(p.random);
        }
        return map.get(head);
    }
}`
},
{
  lc: 148,
  title: "排序链表",
  cat: "链表",
  diff: "中等",
  tier: "A",
  budget: 150,
  pattern: "链表归并排序",
  desc: "在 O(n log n) 时间内对链表进行升序排序。",
  idea: "归并排序：快慢指针找中点并断开，两半分别递归排序，再用合并两个有序链表的方法合并。",
  traps: ["找中点后必须断链 slow.next = null", "快指针从 head.next 起步才能让中点偏左，避免两节点时死循环"],
  comp: "时间 O(n log n)，空间 O(log n)（递归栈）",
  code: `class Solution {
    public ListNode sortList(ListNode head) {
        if (head == null || head.next == null) return head;
        ListNode slow = head, fast = head.next;   // fast 先一步，防死循环
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        ListNode mid = slow.next;
        slow.next = null;                          // 断链
        ListNode l = sortList(head), r = sortList(mid);
        ListNode dummy = new ListNode(0), tail = dummy;
        while (l != null && r != null) {           // 合并两有序链表
            if (l.val <= r.val) { tail.next = l; l = l.next; }
            else { tail.next = r; r = r.next; }
            tail = tail.next;
        }
        tail.next = l != null ? l : r;
        return dummy.next;
    }
}`
},
{
  lc: 146,
  title: "LRU 缓存",
  cat: "链表",
  diff: "中等",
  tier: "S",
  budget: 240,
  pattern: "哈希+双向链表",
  desc: "实现 get/put 均为 O(1) 的 LRU（最近最少使用）缓存。",
  idea: "HashMap 定位节点 + 手写双向链表维护使用顺序：靠近头部 = 最近使用。get 命中移到头部；put 已存在则更新并移头，新增超容量时删除尾部节点并同步删 map。",
  traps: ["哨兵 head/tail 免去所有空判断", "删尾节点时记得 map.remove(节点的 key)，所以节点要存 key", "put 已存在的 key 也要移到头部"],
  comp: "get/put 均时间 O(1)，空间 O(capacity)",
  code: `class LRUCache {
    class Node {
        int key, value;
        Node prev, next;
        Node(int k, int v) { key = k; value = v; }
    }

    private final int capacity;
    private final Map<Integer, Node> map = new HashMap<>();
    private final Node head = new Node(0, 0), tail = new Node(0, 0); // 哨兵

    public LRUCache(int capacity) {
        this.capacity = capacity;
        head.next = tail;
        tail.prev = head;
    }

    public int get(int key) {
        Node node = map.get(key);
        if (node == null) return -1;
        moveToHead(node);
        return node.value;
    }

    public void put(int key, int value) {
        Node node = map.get(key);
        if (node != null) {
            node.value = value;
            moveToHead(node);
            return;
        }
        node = new Node(key, value);
        map.put(key, node);
        addFirst(node);
        if (map.size() > capacity) {
            Node last = tail.prev;   // 淘汰最久未用
            remove(last);
            map.remove(last.key);
        }
    }

    private void remove(Node n) {
        n.prev.next = n.next;
        n.next.prev = n.prev;
    }

    private void addFirst(Node n) {
        n.next = head.next;
        n.prev = head;
        head.next.prev = n;
        head.next = n;
    }

    private void moveToHead(Node n) {
        remove(n);
        addFirst(n);
    }
}`
},
{
  lc: 94,
  title: "二叉树的中序遍历",
  cat: "二叉树",
  diff: "简单",
  tier: "B",
  budget: 60,
  pattern: "栈迭代",
  desc: "返回二叉树的中序遍历（左-根-右）结果。",
  idea: "栈迭代：一路把左孩子压栈到底，弹出访问，然后转向其右子树重复。递归版一行：左、收集、右。",
  traps: ["外层循环条件是 cur != null || 栈非空"],
  comp: "时间 O(n)，空间 O(h)",
  code: `class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> ans = new ArrayList<>();
        Deque<TreeNode> stack = new ArrayDeque<>();
        TreeNode cur = root;
        while (cur != null || !stack.isEmpty()) {
            while (cur != null) {   // 一路向左压栈
                stack.push(cur);
                cur = cur.left;
            }
            cur = stack.pop();      // 弹出访问
            ans.add(cur.val);
            cur = cur.right;        // 转向右子树
        }
        return ans;
    }
}`
},
{
  lc: 104,
  title: "二叉树的最大深度",
  cat: "二叉树",
  diff: "简单",
  tier: "B",
  budget: 60,
  pattern: "递归",
  desc: "求二叉树根节点到最远叶子的最长路径上的节点数。",
  idea: "递归：深度 = 1 + max(左子树深度, 右子树深度)，空节点为 0。",
  traps: ["追问迭代版：层序遍历数层数"],
  comp: "时间 O(n)，空间 O(h)",
  code: `class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null) return 0;
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
    }
}`
},
{
  lc: 226,
  title: "翻转二叉树",
  cat: "二叉树",
  diff: "简单",
  tier: "B",
  budget: 60,
  pattern: "递归交换",
  desc: "左右镜像翻转整棵二叉树。",
  idea: "递归：交换当前节点的左右孩子，再分别递归翻转两个子树。",
  traps: ["先暂存一侧再交换，或交换后再递归都可以"],
  comp: "时间 O(n)，空间 O(h)",
  code: `class Solution {
    public TreeNode invertTree(TreeNode root) {
        if (root == null) return null;
        TreeNode t = root.left;     // 交换左右
        root.left = invertTree(root.right);
        root.right = invertTree(t);
        return root;
    }
}`
},
{
  lc: 101,
  title: "对称二叉树",
  cat: "二叉树",
  diff: "简单",
  tier: "B",
  budget: 60,
  pattern: "镜像递归",
  desc: "判断二叉树是否轴对称。",
  idea: "辅助函数比较一对镜像节点 (p, q)：值相等且 (p.left, q.right)、(p.right, q.left) 也镜像相等。",
  traps: ["初始调用是 check(root.left, root.right)", "一空一非空返回 false，两空返回 true"],
  comp: "时间 O(n)，空间 O(h)",
  code: `class Solution {
    public boolean isSymmetric(TreeNode root) {
        return root == null || check(root.left, root.right);
    }

    private boolean check(TreeNode p, TreeNode q) {
        if (p == null && q == null) return true;
        if (p == null || q == null || p.val != q.val) return false;
        return check(p.left, q.right) && check(p.right, q.left); // 镜像对
    }
}`
},
{
  lc: 543,
  title: "二叉树的直径",
  cat: "二叉树",
  diff: "简单",
  tier: "A",
  budget: 150,
  pattern: "求深度顺带更新",
  desc: "求二叉树中任意两节点路径长度（边数）的最大值，路径可不经过根。",
  idea: "在求深度的递归中顺带做事：经过每个节点的最长路径 = 左深 + 右深，用它更新全局答案；递归返回 1 + max(左, 右)。",
  traps: ["直径单位是边数，所以是 左深+右深 而不再 +1", "返回值和答案更新是两件事，别混"],
  comp: "时间 O(n)，空间 O(h)",
  code: `class Solution {
    private int ans = 0;

    public int diameterOfBinaryTree(TreeNode root) {
        depth(root);
        return ans;
    }

    private int depth(TreeNode node) {
        if (node == null) return 0;
        int l = depth(node.left), r = depth(node.right);
        ans = Math.max(ans, l + r);   // 经过 node 的最长路径
        return 1 + Math.max(l, r);
    }
}`
},
{
  lc: 102,
  title: "二叉树的层序遍历",
  cat: "二叉树",
  diff: "中等",
  tier: "S",
  budget: 240,
  pattern: "队列 BFS",
  desc: "逐层从左到右返回二叉树节点值的二维列表。",
  idea: "队列 BFS：每轮先取当前队列长度 size，恰好循环 size 次出队收集为一层，同时把子节点入队。",
  traps: ["size 必须在循环前取定，队列长度在循环中会变", "root 为 null 直接返回空列表"],
  comp: "时间 O(n)，空间 O(n)",
  code: `class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> ans = new ArrayList<>();
        if (root == null) return ans;
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        while (!queue.isEmpty()) {
            int size = queue.size();          // 本层节点数
            List<Integer> level = new ArrayList<>();
            for (int i = 0; i < size; i++) {
                TreeNode node = queue.poll();
                level.add(node.val);
                if (node.left != null) queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }
            ans.add(level);
        }
        return ans;
    }
}`
},
{
  lc: 108,
  title: "将有序数组转换为二叉搜索树",
  cat: "二叉树",
  diff: "简单",
  tier: "B",
  budget: 60,
  pattern: "中点定根递归",
  desc: "将升序数组转换为一棵平衡二叉搜索树。",
  idea: "取区间中点作为根，左半边递归建左子树，右半边递归建右子树，天然平衡。",
  traps: ["递归边界 l > r 返回 null"],
  comp: "时间 O(n)，空间 O(log n)",
  code: `class Solution {
    public TreeNode sortedArrayToBST(int[] nums) {
        return build(nums, 0, nums.length - 1);
    }

    private TreeNode build(int[] nums, int l, int r) {
        if (l > r) return null;
        int mid = (l + r) / 2;             // 中点为根
        TreeNode root = new TreeNode(nums[mid]);
        root.left = build(nums, l, mid - 1);
        root.right = build(nums, mid + 1, r);
        return root;
    }
}`
},
{
  lc: 98,
  title: "验证二叉搜索树",
  cat: "二叉树",
  diff: "中等",
  tier: "A",
  budget: 150,
  pattern: "递归传上下界",
  desc: "判断二叉树是否是合法的二叉搜索树。",
  idea: "递归传开区间 (min, max)：节点值必须严格落在区间内，往左走收紧上界，往右走收紧下界。用 Long 规避节点值等于 Integer 边界的坑。",
  traps: ["只比较父子是不够的，必须全子树满足，所以要传上下界", "用 long 防 Integer.MIN_VALUE/MAX_VALUE 测试用例", "备选：中序遍历严格递增"],
  comp: "时间 O(n)，空间 O(h)",
  code: `class Solution {
    public boolean isValidBST(TreeNode root) {
        return check(root, Long.MIN_VALUE, Long.MAX_VALUE);
    }

    private boolean check(TreeNode node, long min, long max) {
        if (node == null) return true;
        if (node.val <= min || node.val >= max) return false; // 严格开区间
        return check(node.left, min, node.val) && check(node.right, node.val, max);
    }
}`
},
{
  lc: 230,
  title: "二叉搜索树中第 K 小的元素",
  cat: "二叉树",
  diff: "中等",
  tier: "A",
  budget: 150,
  pattern: "中序第 k 个",
  desc: "返回二叉搜索树中第 k 小的节点值。",
  idea: "BST 的中序遍历就是升序序列：栈迭代做中序，第 k 个弹出的节点即答案，无需遍历完整棵树。",
  traps: ["迭代版可提前终止，比递归收集全部再取更优", "追问频繁查询：节点维护子树大小"],
  comp: "时间 O(h+k)，空间 O(h)",
  code: `class Solution {
    public int kthSmallest(TreeNode root, int k) {
        Deque<TreeNode> stack = new ArrayDeque<>();
        TreeNode cur = root;
        while (cur != null || !stack.isEmpty()) {
            while (cur != null) {
                stack.push(cur);
                cur = cur.left;
            }
            cur = stack.pop();
            if (--k == 0) return cur.val; // 第 k 个出栈
            cur = cur.right;
        }
        return -1;
    }
}`
},
{
  lc: 199,
  title: "二叉树的右视图",
  cat: "二叉树",
  diff: "中等",
  tier: "A",
  budget: 150,
  pattern: "BFS 取层尾",
  desc: "返回从右侧看二叉树能看到的节点值（每层最右）。",
  idea: "层序遍历，每层只收集最后一个出队的节点。DFS 备选：按 根→右→左 遍历，当深度等于结果集大小时收集。",
  traps: ["右视图不是一路向右走，左子树可能更深"],
  comp: "时间 O(n)，空间 O(n)",
  code: `class Solution {
    public List<Integer> rightSideView(TreeNode root) {
        List<Integer> ans = new ArrayList<>();
        if (root == null) return ans;
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        while (!queue.isEmpty()) {
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                TreeNode node = queue.poll();
                if (i == size - 1) ans.add(node.val); // 本层最右
                if (node.left != null) queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }
        }
        return ans;
    }
}`
},
{
  lc: 114,
  title: "二叉树展开为链表",
  cat: "二叉树",
  diff: "中等",
  tier: "A",
  budget: 150,
  pattern: "前驱法",
  desc: "将二叉树原地展开为只用 right 指针、顺序同前序遍历的链表。",
  idea: "对每个有左子树的节点：找到左子树的最右节点（前序中左子树的最后一个），把原右子树挂到它的 right 上，再把左子树整体移到右边、左指针置空。",
  traps: ["前驱是左子树一路向右走到底的节点", "O(1) 空间是这题的亮点，递归后序也行但占栈"],
  comp: "时间 O(n)，空间 O(1)",
  code: `class Solution {
    public void flatten(TreeNode root) {
        TreeNode cur = root;
        while (cur != null) {
            if (cur.left != null) {
                TreeNode pre = cur.left;            // 找左子树最右节点
                while (pre.right != null) pre = pre.right;
                pre.right = cur.right;              // 原右子树挂过去
                cur.right = cur.left;               // 左子树整体右移
                cur.left = null;
            }
            cur = cur.right;
        }
    }
}`
},
{
  lc: 105,
  title: "从前序与中序遍历序列构造二叉树",
  cat: "二叉树",
  diff: "中等",
  tier: "S",
  budget: 240,
  pattern: "前序定根+中序切分",
  desc: "根据前序和中序遍历序列（无重复值）重建二叉树。",
  idea: "前序第一个元素是根；用哈希表在中序中定位根的下标，左边是左子树、右边是右子树，左子树大小决定前序的切分点，递归构建。",
  traps: ["哈希表预存中序下标，避免每层 O(n) 查找", "前序左子树区间长度 = 中序根下标 − 中序左端"],
  comp: "时间 O(n)，空间 O(n)",
  code: `class Solution {
    private Map<Integer, Integer> idx = new HashMap<>();
    private int[] preorder;

    public TreeNode buildTree(int[] preorder, int[] inorder) {
        this.preorder = preorder;
        for (int i = 0; i < inorder.length; i++) idx.put(inorder[i], i);
        return build(0, preorder.length - 1, 0, inorder.length - 1);
    }

    private TreeNode build(int preL, int preR, int inL, int inR) {
        if (preL > preR) return null;
        TreeNode root = new TreeNode(preorder[preL]); // 前序首元素定根
        int mid = idx.get(preorder[preL]);            // 根在中序的位置
        int leftSize = mid - inL;
        root.left = build(preL + 1, preL + leftSize, inL, mid - 1);
        root.right = build(preL + leftSize + 1, preR, mid + 1, inR);
        return root;
    }
}`
},
{
  lc: 437,
  title: "路径总和 III",
  cat: "二叉树",
  diff: "中等",
  tier: "A",
  budget: 150,
  pattern: "前缀和+DFS 回溯",
  desc: "统计二叉树中节点值之和等于 targetSum 的向下路径数（起终点任意）。",
  idea: "树上前缀和：DFS 时维护根到当前节点的前缀和 sum，答案累加 map[sum − target]（以某祖先为起点的路径数），递归前计数 +1、回溯时撤销。",
  traps: ["初始 put(0, 1)", "回溯时必须撤销当前前缀和的计数", "节点值可达 10^9 量级，前缀和用 long"],
  comp: "时间 O(n)，空间 O(n)",
  code: `class Solution {
    private Map<Long, Integer> cnt = new HashMap<>();
    private int target;

    public int pathSum(TreeNode root, int targetSum) {
        target = targetSum;
        cnt.put(0L, 1);              // 空前缀
        return dfs(root, 0L);
    }

    private int dfs(TreeNode node, long sum) {
        if (node == null) return 0;
        sum += node.val;
        int ans = cnt.getOrDefault(sum - target, 0); // 以某祖先为起点
        cnt.merge(sum, 1, Integer::sum);
        ans += dfs(node.left, sum) + dfs(node.right, sum);
        cnt.merge(sum, -1, Integer::sum);            // 回溯撤销
        return ans;
    }
}`
},
{
  lc: 236,
  title: "二叉树的最近公共祖先",
  cat: "二叉树",
  diff: "中等",
  tier: "S",
  budget: 240,
  pattern: "后序递归",
  desc: "找出二叉树中两个指定节点的最近公共祖先。",
  idea: "后序递归：遇到 null 或 p、q 直接返回自身；左右子树分别递归，两边都非空说明 p、q 分居两侧，当前节点即 LCA；只有一边非空就把它往上传。",
  traps: ["p 是 q 的祖先时，递归到 p 就返回，天然正确", "前提是 p、q 必在树中"],
  comp: "时间 O(n)，空间 O(h)",
  code: `class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null || root == p || root == q) return root;
        TreeNode left = lowestCommonAncestor(root.left, p, q);
        TreeNode right = lowestCommonAncestor(root.right, p, q);
        if (left != null && right != null) return root; // 分居两侧
        return left != null ? left : right;             // 单侧上传
    }
}`
}
);
