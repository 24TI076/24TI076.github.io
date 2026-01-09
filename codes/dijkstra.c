#include <stdio.h>
#include <stdlib.h>
#include <limits.h> /* for INT_MAX */
#define FALSE 0
#define TRUE (!FALSE)
#define INFINITY INT_MAX
#define MAXSIZE 10

typedef struct node {
    int key, weight;
    struct node *next;
} Node;

// weight: 隣接リストで表されたグラフ
// start: 開始ノード番号
// num_of_vert: ノード数
// prev: 前のノード番号を保存する配列
// 戻り値: 開始のノードから各ノードまでの最短距離のポインタ
int *dijkstra(Node *weight, int start, int num_of_vert, int *prev);
int insert_edge(int cost, int node_idx, int next_node_idx, Node *n);

int main(void)
{
	Node weight[MAXSIZE];
	int i, j, k, n, vertex, data, cost, idx, start, tmp[MAXSIZE], prev[MAXSIZE], *dist;

	// 初期化
	for(i = 0; i < MAXSIZE; i++)
		weight[i].next = NULL;

	// グラフの受け取り
	printf("Input data size> ");//頂点の数
	scanf("%d", &n);
	printf("%d\n", n);
	for (i = 0; i < n; i++) {
		printf("Input vertex> ");//頂点番号
		scanf("%d", &data);
		printf("%d\n", data);
		printf("Input connected vertex num> ");//つながった頂点の数
		scanf("%d", &k);
		printf("%d\n", k);
		for(j = 0; j < k; j++) {
			printf("Input connected vertex and cost> ");//つながった頂点番号と重み
			scanf("%d %d", &vertex, &cost);
			printf("%d %d\n", vertex, cost);
			insert_edge(cost, i, vertex, weight);//リストに入れる
		}
	}
	// 開始ノード受け取り
	printf("\n");
	printf("Input> ");
	scanf("%d", &start);
	printf("%d\n", start);

	dist = dijkstra(weight, start, n, prev);

    /*** dijkstraで求めた解を出力 ***/
	for(int i = 0; i < n; i++){
		printf("%d-->%d : %d ( ",start,i,dist[i]);
		k = 0;
		for(j = i; j != -1; j = prev[j]){
			tmp[k] = j;
			k++;
		}
		for(j = k - 1; j >= 0; j--){
			printf("%d ",tmp[j]);
		}
		printf(")\n");
	}

	free(dist);

	return 0;
}

// 辺の重み、接続元ノード番号、接続するノード番号、
int insert_edge(int cost, int node_idx, int next_node_idx, Node *n)
{
	Node *new;
	Node *tmp;

	new = (Node*)malloc(sizeof(Node));
	new->next = NULL;
	new->key = next_node_idx;
	new->weight = cost;

	tmp = &n[node_idx];

	while(tmp->next != NULL) {
		tmp = tmp->next;
	}

	tmp->next = new;

	return 1;
}

int *dijkstra(Node *weight, int start, int num_of_vert, int *prev)
{
    /*** 隣接リスト（weight）で表されたグラフに対して、dijkstra法を適用 ***/
	int *dist;
	dist = (int*)malloc(sizeof(int) * num_of_vert);
	int visited[num_of_vert];
	for(int i = 0; i < num_of_vert; i++){
		dist[i] = INFINITY;
		visited[i] = FALSE;
		prev[i] = -1;
	}
	dist[start] = 0;
	for(int idx = 0; idx < num_of_vert; idx++){
		int unvisit_vert = -1;
		int min_dist = INFINITY;
		for(int j = 0; j < num_of_vert; j++){
			if(visited[j] == FALSE && dist[j] < min_dist){
				min_dist = dist[j];
				unvisit_vert = j;
			}
		}
		if(unvisit_vert == -1){
			break;
		}
		visited[unvisit_vert] = TRUE;
		for(Node *cur = weight[unvisit_vert].next; cur != NULL ; cur = cur->next){
			if(visited[cur->key] == FALSE && dist[unvisit_vert] + cur->weight < dist[cur->key]){
				dist[cur->key] = dist[unvisit_vert] + cur->weight;
				prev[cur->key] = unvisit_vert;
			}
		}
	}
	return dist;
}
