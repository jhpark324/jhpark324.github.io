---
layout: single
title: "[python] 윈도우에서 pyzerox 인코딩 에러"
categories: python
tags: [python]
toc: true
---

## window에서 pyzerox 인코딩 에러

### pyzerox를 통해 pdf -> md 로 변환 중 겪은 문제

zerox함수를 통해 md파일로 변환할때 인코딩 문제가 남

```bash
UnicodeEncodeError: 'cp949' codec can't encode character '\u2013' in position 968: illegal multibyte sequence
```

- 인코딩 문제
- 모델에서 답변 줄 때 UTF-8로 파싱되어서 오는데 윈도우에서 이를 CP949로 저장하려고 하므로 에러가 남

### 해결방안

- zerox함수 확인

```python
        # Write the aggregated markdown to a file
        if output_dir:
            result_file_path = os.path.join(output_dir, f"{file_name}.md")
            async with aiofiles.open(result_file_path, "w") as f:
                await f.write("\n\n".join(aggregated_markdown))
```

- 쓰는 과정에서 인코딩 타입이 지정되지 않아 윈도우 디폴트인 cp949인코딩으로 UTF-8에는 있는 문자가 CP949에 없다면 에러가 남
- 윈도우 설정으로 기본 인코딩 타입을 변경하거나 해당 함수 변경

```python
        # Write the aggregated markdown to a file
        if output_dir:
            result_file_path = os.path.join(output_dir, f"{file_name}.md")
            save_encoding = "utf-8"
            async with aiofiles.open(result_file_path, "w", encoding=save_encoding) as f:
                await f.write("\n\n".join(aggregated_markdown))
```

- 간단하게 인코딩 타입만 명시해서 해당 인코딩으로 강제함
- 해당 에러가 더 이상 안잡히는 걸 확인

| 버그로 PR 올릴려 했는데 최신 버전에서는 해당 버그가 잡혀있었음.. 아쉽다!!