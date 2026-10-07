#include <stdint.h>
#include <time.h>
void PR_Init(int a,int b,int c){(void)a;(void)b;(void)c;}
typedef uint64_t PRUint64;
PRUint64 PR_Now(void){struct timespec ts;clock_gettime(CLOCK_REALTIME,&ts);return (PRUint64)ts.tv_sec*1000000ULL+ts.tv_nsec/1000;}
int32_t PR_GetError(void){return 0;}
int32_t PR_GetOSError(void){return 0;}
const char *PR_GetErrorText(void){return "";}
int32_t PR_GetErrorTextLength(void){return 0;}
