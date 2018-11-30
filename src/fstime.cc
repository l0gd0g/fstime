// addon.cc
#include <sys/types.h>
#include <sys/stat.h>
#include <time.h>
#include <node.h>
#include <string>
#include <sstream>

#include <stdio.h>
#include <unistd.h>
#include <errno.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include <fcntl.h>

using namespace v8;

namespace demo
{

using v8::Exception;
using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::String;
using v8::Value;

void statsSync(const FunctionCallbackInfo<Value> &args)
{
	Isolate *isolate = Isolate::GetCurrent();
	HandleScope scope(isolate);

	struct stat sb;
	char *fileName;

	v8::String::Utf8Value str(args[0]->ToString());
	fileName = *str;

	if (lstat(fileName, &sb) == -1)
	{
		isolate->ThrowException(Exception::TypeError(String::NewFromUtf8(isolate, "Wrong file stat")));
		return;
	}

	Local<Object> obj = Object::New(isolate);

	obj->Set(String::NewFromUtf8(isolate, "dev"), Integer::New(isolate, sb.st_dev));
	obj->Set(String::NewFromUtf8(isolate, "mode"), Integer::New(isolate, sb.st_mode));
	obj->Set(String::NewFromUtf8(isolate, "nlink"), Integer::New(isolate, sb.st_nlink));
	obj->Set(String::NewFromUtf8(isolate, "uid"), Integer::New(isolate, sb.st_uid));
	obj->Set(String::NewFromUtf8(isolate, "gid"), Integer::New(isolate, sb.st_gid));
	obj->Set(String::NewFromUtf8(isolate, "rdev"), Integer::New(isolate, sb.st_rdev));
	obj->Set(String::NewFromUtf8(isolate, "blksize"), Integer::New(isolate, sb.st_blksize));
	obj->Set(String::NewFromUtf8(isolate, "ino"), Integer::New(isolate, sb.st_ino));
	obj->Set(String::NewFromUtf8(isolate, "size"), Integer::New(isolate, sb.st_size));
	obj->Set(String::NewFromUtf8(isolate, "blocks"), Integer::New(isolate, sb.st_blocks));

	obj->Set(String::NewFromUtf8(isolate, "atime_sec"), Integer::New(isolate, sb.st_atim.tv_sec));
	obj->Set(String::NewFromUtf8(isolate, "atime_nsec"), Integer::New(isolate, sb.st_atim.tv_nsec));

	obj->Set(String::NewFromUtf8(isolate, "mtime_sec"), Integer::New(isolate, sb.st_mtim.tv_sec));
	obj->Set(String::NewFromUtf8(isolate, "mtime_nsec"), Integer::New(isolate, sb.st_mtim.tv_nsec));

	obj->Set(String::NewFromUtf8(isolate, "ctime_sec"), Integer::New(isolate, sb.st_ctim.tv_sec));
	obj->Set(String::NewFromUtf8(isolate, "ctime_nsec"), Integer::New(isolate, sb.st_ctim.tv_nsec));

	args.GetReturnValue().Set(obj);
}

void utimesSync(const FunctionCallbackInfo<Value> &args)
{
	Isolate *isolate = Isolate::GetCurrent();
	HandleScope scope(isolate);

	char *fileName;
	v8::String::Utf8Value str(args[0]->ToString());
	fileName = *str;

	struct stat sb;

	if (lstat(fileName, &sb) == -1)
	{
		isolate->ThrowException(Exception::TypeError(String::NewFromUtf8(isolate, "Wrong file stat")));
		return;
	}

	struct timespec ts[2];
	ts[0].tv_sec = args[1]->NumberValue();	//atime
	ts[0].tv_nsec = args[2]->NumberValue(); //atime nano part
	ts[1].tv_sec = args[3]->NumberValue();	//mtime
	ts[1].tv_nsec = args[4]->NumberValue(); //mtime nano part

	if (utimensat(AT_FDCWD, fileName, ts, AT_SYMLINK_NOFOLLOW) < 0)
	{ // This updates Change timestamp!
		isolate->ThrowException(Exception::TypeError(String::NewFromUtf8(isolate, strerror(errno))));
	}
}

void Init(Local<Object> exports)
{
	NODE_SET_METHOD(exports, "statsSync", statsSync);
	NODE_SET_METHOD(exports, "utimesSync", utimesSync);
}

NODE_MODULE(addon, Init)

} // namespace demo
