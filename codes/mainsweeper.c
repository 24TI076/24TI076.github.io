#include <stdio.h>
#define RANGE 9
#define HBOMB 13
#define FBOMB 12
#define OBOMB 11
#define CLOSED 10
#define FLAGED 9
#define OPENED8 8
#define OPENED7 7
#define OPENED6 6
#define OPENED5 5
#define OPENED4 4
#define OPENED3 3
#define OPENED2 2
#define OPENED1 1
#define OPENED0 0
#define HIT  2
#define NEAR 1
#define MISS 0
#define FLAG 2
#define ATTACK 1

void print_matrix(int matrix[][RANGE]){
    int x,y;
    printf("   ");
    for(x=0;x<RANGE;x++){
        printf("=%d=", x);
    }
    printf("\n");
    for(y=0;y<RANGE;y++){
        printf(" %d ", y);
        for(x=0;x<RANGE;x++){
           switch(matrix[y][x]){
               case CLOSED:   printf(" - "); break;
               case HBOMB:   printf(" - "); break;
               case OPENED0:   printf(" 0 "); break;
               case OPENED1:   printf(" 1 "); break;
               case OPENED2:   printf(" 2 "); break;
               case OPENED3:   printf(" 3 "); break;
               case OPENED4:   printf(" 4 "); break;
               case OPENED5:   printf(" 5 "); break;
               case OPENED6:   printf(" 6 "); break;
               case OPENED7:   printf(" 7 "); break;
               case OPENED8:   printf(" 8 "); break;
               case FLAGED:   printf(" |>"); break;
               case FBOMB:   printf(" |>"); break;
               case OBOMB:   printf(">^<"); break;
           }
        }
        printf("\n");
    }
    printf("   ");
    for(x=0;x<RANGE;x++){
        printf("===");
    }
    printf("\n");
    return;
}

int attack(int matrix[][RANGE], int x, int y){
    int px, py;
    int num = 0;
    if(matrix[y][x] == HBOMB){
        matrix[y][x] = OBOMB;
        return HIT;
    }else if(matrix[y][x] == FLAGED || matrix[y][x] == FBOMB){
        return MISS;
    }else if(matrix[y][x] == CLOSED){
        for(py = y - 1; py <= y + 1; py++){
            if(py < 0 || py >= RANGE) continue;
            for(px = x - 1; px <= x + 1; px++){
                if(px<0 || px>=RANGE) continue;
                if(matrix[py][px] >= 11){
                    num++; 
                }
            }
        }
        matrix[y][x] = num;
        return NEAR;
    }
}

int flag(int matrix[][RANGE], int x, int y){
    if(matrix[y][x] == CLOSED){
        matrix[y][x] = OBOMB;
    }else if(matrix[y][x] == HBOMB){
        matrix[y][x] == FBOMB;
    }
    return 0;
}

int check_complete(int matrix[][RANGE]){
    int x, y, n = 0;
    for(y = 0; y < RANGE; y++){
        for(x = 0; x < RANGE; x++){
            if(matrix[y][x] == HBOMB){
                n++;
            }
        }
    }
    for(y = 0; y < RANGE; y++){
        for(x = 0; x < RANGE; x++){
            if(matrix[y][x] == OBOMB){
                n = -1;
            }
        }
    }            
    return n;
}

void point(int *x,int *y){
    do{
        printf("x ? ");
        scanf("%d", x);
    }while(*x < 0 || *x >= RANGE);
    do{ 
        printf("y ? ");
        scanf("%d", y);
    }while(*y < 0 || *y >= RANGE);
}

int main(void){
    int x, y, action = 0, matrix[RANGE][RANGE], trialTime = 1;
    for(y = 0; y < RANGE; y++){
        for(x = 0; x < RANGE; x++){
            matrix[y][x]=CLOSED;
        }
    }
    matrix[2][3] = HBOMB;    /* Set baloon (3,2) */
    matrix[5][6] = HBOMB;    /* Set baloon (6,5) */

    print_matrix(matrix);
    while(1){
        printf("Which do you want? Please input number. 1:attack / 2:flag\n");
        do{
            scanf("%d",&action);
        }while(action != ATTACK && action != FLAG)
        if(action == ATTACK){
            point(&x,&y);
            int resut = attack(matrix, x, y);
            print_matrix(matrix);
            switch(resut){
                case MISS: printf("MISS!\n"); break;
                case NEAR: printf("NEAR!\n"); break;
                case HIT:  printf("HIT!\n");  break;
            }
        }else{
            point(&x,&y);
            flag(matrix, x, y);
        }
        
        int n = check_complete(matrix);
        if(n == 0) {
            printf("!!!CLEAR!!! trial time is %d\n\n", trialTime);
            return 0;
        }else if(n == -1){
            printf("!!!GAME OVER!!!");
            return 0;
        }
        printf("%d bombs are left\n\n", n);
        trialTime++;
    }
}
